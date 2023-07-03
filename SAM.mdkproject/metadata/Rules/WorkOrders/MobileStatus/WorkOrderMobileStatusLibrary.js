import libMobile from '../../MobileStatus/MobileStatusLibrary';
import libCommon from '../../Common/Library/CommonLibrary';
import {PartnerFunction} from '../../Common/Library/PartnerFunction';
import Logger from '../../Log/Logger';
import isTimeSheetsEnabled from '../../TimeSheets/TimeSheetsIsEnabled';
import isConfirmationsEnabled from '../../Confirmations/ConfirmationsIsEnabled';
import confirmationsCreateUpdateNav from '../../Confirmations/CreateUpdate/ConfirmationCreateUpdateNav';
import WorkOrderOperationsCount from '../Operations/WorkOrderOperationsCount';
import CompleteWorkOrderMobileStatusAction from './CompleteWorkOrderMobileStatusAction';
import libClock from '../../ClockInClockOut/ClockInClockOutLibrary';
import WorkOrderStartStatus from '../MobileStatus/WorkOrderStartStatus';
import authorizedConfirmationCreate from '../../UserAuthorizations/Confirmations/EnableConfirmationCreate';
import authorizedTimeSheetCreate from '../../UserAuthorizations/TimeSheets/EnableTimeSheetCreate';
import isSignatureControlEnabled from '../../SignatureControl/SignatureControlViewPermission';
import libDigSig from '../../DigitalSignature/DigitalSignatureLibrary';
import checkDeviceRegistration from '../../DigitalSignature/CheckDeviceCreation';
import libSuper from '../../Supervisor/SupervisorLibrary';
import noteWrapper from '../../Supervisor/MobileStatus/NoteWrapper';
import deviceRegistration from '../../DigitalSignature/TOTPDeviceRegistration';
import IsAssignOrUnAssignEnableWorkOrder from './IsAssignOrUnAssignEnableWorkOrder';
import libThis from './WorkOrderMobileStatusLibrary';
import ODataDate from '../../Common/Date/ODataDate';
import generateGUID from '../../Common/guid';
import {GlobalVar} from '../../Common/Library/GlobalCommon';
import EnableFieldServiceTechnician from '../../SideDrawer/EnableFieldServiceTechnician';
import WorkOrdersFSMQueryOption from '../ListView/WorkOrdersFSMQueryOption';
const workOrderDetailsPage = 'WorkOrderDetailsPage';

export default class {

    static startWorkOrder(context) {
        var woStarted = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
        return libClock.setInterimMobileStatus(context, woStarted).then(() => { //Handle clock in/out logic
            if (context.getPageProxy) {
                libMobile.setStartStatus(context.getPageProxy());
            } else {
                libMobile.setStartStatus(context);
            }
            libCommon.SetBindingObject(context);
            return context.executeAction('/SAPAssetManager/Actions/WorkOrders/WorkOrderStartUpdate.action').then(() => {
                //Set toolbar caption.
                this.setCaption(context, 'Start');
                //Set context binding object mobile status to started.
                context.getBindingObject().OrderMobileStatus_Nav.MobileStatus = woStarted;
                //Set WorkOrderDetailsPage state variable isAnyWorkOrderStarted = true
                libCommon.setStateVariable(context, 'isAnyWorkOrderStarted', true, 'WorkOrderDetailsPage');

                return context.executeAction({'Name': '/SAPAssetManager/Actions/ClockInClockOut/WorkOrderClockInOut.action', 'Properties': {
                    'Properties': {
                        'RecordId': generateGUID(),
                        'UserGUID': libCommon.getUserGuid(context),
                        'OperationNo': '',
                        'SubOperationNo': '',
                        'OrderId': context.binding.OrderId,
                        'PreferenceGroup': libClock.isCICOEnabled(context) ? 'CLOCK_IN' : 'START_TIME',
                        'PreferenceName': context.binding.OrderId,
                        'PreferenceValue': new ODataDate().toDBDateTimeString(context),
                        'UserId': libCommon.getSapUserName(context),
                    },
                    'CreateLinks': [{
                        'Property': 'WOHeader_Nav',
                        'Target':
                        {
                            'EntitySet': 'MyWorkOrderHeaders',
                            'ReadLink': `MyWorkOrderHeaders('${context.binding.OrderId}')`,
                        },
                    }],
                }}).then(() => {
                    return libClock.reloadUserTimeEntries(context).then(() => {
                        this.setCaption(context, 'Start');
                        return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/WorkOrderMobileStatusSuccessMessage.action');
                    });
                }).catch(err => {
                    context.dismissActivityIndicator();
                    /**Implementing our Logger class*/
                    Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryWorkOrders.global').getValue(), err);
                    return '';
                });
            },
            () => {
                return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/WorkOrderMobileStatusFailureMessage.action');
            });
        });
    }

    static showTimeCaptureMessage(context, isFinalRequired=false, mobileStatus, checkWorkOrderComplete=true) {

        let reviewStatus = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReviewParameterName.global').getValue());
        let rejectedStatus = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/RejectedParameterName.global').getValue());
        let confirm = (isConfirmationsEnabled(context) && authorizedConfirmationCreate(context));
        let timesheet = (isTimeSheetsEnabled(context) && authorizedTimeSheetCreate(context));

        if (confirm) { //Check if this work order is in review status and supervisor has time flag
            if (mobileStatus && (mobileStatus === reviewStatus || mobileStatus === rejectedStatus)) {
                confirm = libSuper.isSupervisorTimeEnabled(context);
            }
        } else if (timesheet) { //Check if this work order is in review status and supervisor has time flag
            if (mobileStatus && (mobileStatus === reviewStatus || mobileStatus === rejectedStatus)) {
                timesheet = libSuper.isSupervisorTimeEnabled(context);
            }
        }
        if (confirm) {
            let binding = libCommon.getBindingObject(context);
            return libMobile.getStatusForOperations(context, binding.OrderId).then(query => {
                return WorkOrderOperationsCount(context, query).then(count => {
                    // Check to make sure the count for Confirmation Operations > 0
                    if (count > 0) {
                        // Display the confirmations message
                        ///passing a flag to avoid executing workorder complete twice during confimation flow 
                        return this.showConfirmationMessage(context, isFinalRequired, checkWorkOrderComplete);
                    }
                    // If operation count = 0, do nothing
                    return true;
                });
            });
        } else if (timesheet) {
            // If time sheets is enabled, display time sheet message
            return this.showTimeSheetMessage(context);
        }
        // Default resolve true
        return Promise.resolve(true);
    }

    static showTimeSheetMessage(context) {
        return this.showWorkOrderTimesheetMessage(context).then(bool => {
            if (bool) {
                // Save work order object for later if on context menu
                if (context.constructor.name === 'SectionedTableProxy')
                    context.getClientData().currentObject = context.getPageProxy().getExecutedContextMenuItem().getBinding();
                libCommon.setOnCreateUpdateFlag(context, 'CREATE');
                return context.executeAction('/SAPAssetManager/Actions/TimeSheets/TimeSheetEntryCreateForWONav.action').then(() => {
                    return Promise.resolve();
                }, error => {
                    /**Implementing our Logger class*/
                    context.dismissActivityIndicator();
                    Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryWorkOrders.global').getValue(), error);
                });
            }
            return Promise.resolve();
        });
    }

    static showConfirmationMessage(context, isFinalRequired=false, checkWorkOrderComplete=true) {
        return this.showWorkOrderConfirmationsMessage(context).then(didSelectOk => {
            if (!didSelectOk) {
                return Promise.resolve();
            }
            let startDate = libCommon.getStateVariable(context, 'StatusStartDate');
            let endDate = libCommon.getStateVariable(context, 'StatusEndDate');
            let binding = libCommon.getBindingObject(context);

            // Override page values as shown
            // Setting doCheckWorkOrderComplete to avoid executing workorder complete twice
            let overrides = {
                'IsWorkOrderChangable': false,
                'WorkOrderHeader': binding,
                'OrderID': binding.OrderId,
                'IsFromWorkOrderHold': binding.IsFromWorkOrderHold,
                'Plant' : binding.MainWorkCenterPlant,
                'doCheckWorkOrderComplete':checkWorkOrderComplete,
            };

            if (isFinalRequired) {
                overrides.IsFinalChangable = false;
                overrides.IsFinal = true;
            }

            if (binding.SupervisorDisallowFinal) { //Do not allow tech to change final confirmation slider on review
                binding.SupervisorDisallowFinal = '';
                overrides.IsFinalChangable = false;
            }

            return confirmationsCreateUpdateNav(context, overrides, startDate, endDate).then(() => {
                return Promise.resolve();
            }, error => {
                /**Implementing our Logger class*/
                context.dismissActivityIndicator();
                Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryWorkOrders.global').getValue(), error);
            });

        });
    }

    static holdWorkOrder(context) {
        var parent = this;
        var woHold = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/HoldParameterName.global').getValue());

        let odataDate = new ODataDate();
        return libClock.setInterimMobileStatus(context, woHold).then(() => { //Handle clock in/out logic
            libMobile.setHoldStatus(context);
            libCommon.SetBindingObject(context);
            let binding = context.binding;
            if (context.constructor.name === 'SectionedTableProxy') {
                binding = context.getPageProxy().getExecutedContextMenuItem().getBinding();
            }
            /*
            * Set WorkOrderDetailsPage state variable isAnyWorkOrderStarted to undefined to run the db query again.
            * because we don't know if it was this order that was started or if it was another order.
            */
            libCommon.setStateVariable(context, 'isAnyWorkOrderStarted', undefined, 'WorkOrderDetailsPage');
            return context.executeAction({'Name': '/SAPAssetManager/Actions/WorkOrders/MobileStatus/WorkOrderHoldUpdate.action', 'Properties': {
                'Properties': {
                    'ObjectKey': (function() {
                        let objectKey = '';
                        //If not a local operation, it will have an ObjectKey value
                        if (binding.ObjectKey) {
                            objectKey = binding.ObjectKey;
                        } else if (binding.OperationMobileStatus_Nav.ObjectKey) {
                            //For local operations, we get the local ObjectKey from PMMobileStatuses record.
                            objectKey = binding.OperationMobileStatus_Nav.ObjectKey;
                        }
                        return objectKey;
                    })(),
                    'ObjectType': GlobalVar.getAppParam().OBJECTTYPE.WorkOrder,
                    'MobileStatus': libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/HoldParameterName.global').getValue()),
                    'EffectiveTimestamp': odataDate.toDBDateTimeString(context),
                    'CreateUserGUID': libCommon.getUserGuid(context),
                    'CreateUserId': libCommon.getSapUserName(context),
                },
                'Target': {
                    'EntitySet': 'PMMobileStatuses',
                    'Service': '/SAPAssetManager/Services/AssetManager.service',
                    'ReadLink' : binding.OperationMobileStatus_Nav['@odata.readLink'],
                },
            }}).then(() => {
                //Set context binding object mobile status to hold.
                binding.OrderMobileStatus_Nav.MobileStatus = woHold;
                binding.IsFromWorkOrderHold = true;
                //Handle clock out create for work order
                libClock.setClockOutWorkOrderODataValues(context);
                return context.executeAction({'Name': '/SAPAssetManager/Actions/ClockInClockOut/WorkOrderClockInOut.action', 'Properties': {
                    'Properties': {
                        'RecordId': generateGUID(),
                        'UserGUID': libCommon.getUserGuid(context),
                        'OperationNo': '',
                        'SubOperationNo': '',
                        'OrderId': binding.OrderId,
                        'PreferenceGroup': libClock.isCICOEnabled(context) ? 'CLOCK_OUT' : 'END_TIME',
                        'PreferenceName': binding.OrderId,
                        'PreferenceValue': odataDate.toDBDateTimeString(context),
                        'UserId': libCommon.getSapUserName(context),
                    },
                    'Headers': {
                        'OfflineOData.RemoveAfterUpload': 'false',
                    },
                    'CreateLinks': [{
                        'Property': 'WOHeader_Nav',
                        'Target':
                        {
                            'EntitySet': 'MyWorkOrderHeaders',
                            'ReadLink': "MyWorkOrderHeaders('" + binding.OrderId + "')",
                        },
                    }],
                }}).then(() => {
                    parent.showTimeCaptureMessage(context);
                    return libClock.reloadUserTimeEntries(context).then(() => {
                        context.dismissActivityIndicator();
                        parent.setCaption(context, 'Hold');
                        return Promise.resolve(true);
                    });
                }).catch(err => {
                    context.dismissActivityIndicator();
                    /**Implementing our Logger class*/
                    Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryWorkOrders.global').getValue(), err);
                });
            }, () => {
                return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/WorkOrderMobileStatusFailureMessage.action');
            });
        });
    }

    static showTransferWarningMessage(context) {
        return this.showWorkOrderTransferWarningMessage(context).then(bool => {
            if (bool) {
                libMobile.setTransferStatus(context);
                libCommon.SetBindingObject(context);
                return context.executeAction('/SAPAssetManager/Actions/WorkOrders/WorkOrderTransferNav.action');
            } else {
                return Promise.resolve(false);
            }
        });
    }

    static transferWorkOrder(context) {
        return this.showTransferWarningMessage(context);
    }

    static updateCompleteStatus(context, mobileStatus) {
        let binding = libCommon.getBindingObject(context);
        let actionArgs = {
            WorkOrderId: binding.OrderId,
        };
        let action = new CompleteWorkOrderMobileStatusAction(actionArgs);
        context.getClientData().confirmationArgs = {
            doCheckWorkOrderComplete: false,
        };
        // Add this action to the binding
        context.getClientData().mobileStatusAction = action;
        // Hold the previous state of the context
        let pageContext = context;
        return libSuper.checkReviewRequired(context, binding).then(review => {
            binding.SupervisorDisallowFinal = '';
            if (review) {
                binding.SupervisorDisallowFinal = true; //Tech cannot set final confirmation on review
            }
            return noteWrapper(context, review).then(() => { //Allow tech to leave note for supervisor
                return libThis.showTimeCaptureMessage(context, !review, mobileStatus,false).then(() => { //If review is required, then we cannot pass up a final confirmation
                    return action.execute(context).then(() => {
                        return libThis.didSetWorkOrderComplete(pageContext, mobileStatus);
                    });
                }, () => {
                    return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/WorkOrderMobileStatusFailureMessage.action');
                });
            });
         });
    }

    // Called after the work order has been set to complete
    static didSetWorkOrderComplete(context, mobileStatus) {
        return libSuper.checkReviewRequired(context, context.binding).then(review => {
            if (review) { //target requires review for technician user
                if (!libCommon.getStateVariable(context, 'contextMenuSwipePage')) { //only do this if not from context menu
                    libThis.setCaption(context, 'Review');
                }
                libMobile.setReviewStatus(context);
                return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/WorkOrderMobileStatusSuccessMessage.action');
            }
            if (!libCommon.getStateVariable(context, 'contextMenuSwipePage')) { //only do this if not from context menu
                libThis.setCaption(context, 'Complete');
                libCommon.enableToolBar(context, workOrderDetailsPage, 'IssuePartTbI', false);
                try {
                    context.setActionBarItemVisible(0, false);
                    context.setActionBarItemVisible(1, false);
                } catch (exception) {
                    /**Implementing our Logger class*/
                    Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryWorkOrders.global').getValue(), `workOrdersListViewPage refresh error: ${exception}`);
                }
            }
            
            //remove the marked job related if theres any
            if (libCommon.getBindingObject(context).MarkedJob) {
                context.executeAction('/SAPAssetManager/Actions/WorkOrders/MarkedJobDelete.action');
            }
            
            if (context.getControl('SectionedTable')) {
                context.getControl('SectionedTable').redraw();
            }
            
            let reviewStatus = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReviewParameterName.global').getValue());
            let rejectedStatus = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/RejectedParameterName.global').getValue());
            if (mobileStatus && (mobileStatus === reviewStatus || mobileStatus === rejectedStatus)) {
                let clientData = context.getClientData();
                clientData.ChangeStatus = 'APPROVED';
            }
            return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/WorkOrderMobileStatusSuccessMessage.action');
        });
    }

    // Called after the work order has been set to rejected by a supervisor
    static didSetWorkOrderRejected(context) {
        libThis.setCaption(context, 'Rejected');
        libMobile.setRejectedStatus(context);
        return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/WorkOrderMobileStatusSuccessMessage.action');
    }

    /**
     * When completing work order, operation or sub-operation, capture the notification malfunction end date on associated parent notification if breakdown is set
     * @param {*} context
     */

    static NotificationUpdateMalfunctionEnd(context, woBinding) {
        if (woBinding.NotificationNumber) {
            let binding = libCommon.getBindingObject(context);
            let readLink = woBinding['@odata.readLink'] + '/Notification';
            return context.read('/SAPAssetManager/Services/AssetManager.service', readLink, [], '$expand=NotifMobileStatus_Nav').then(results => {
                if (results && results.length > 0) {
                    let notif = results.getItem(0);
                    let complete = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
                    if (notif.BreakdownIndicator && notif.NotifMobileStatus_Nav.MobileStatus !== complete && !notif.MalfunctionEndDate) {  //Breakdown is set and end date is not set and notification is not already complete
                        let oldBinding = binding;
                        context.getPageProxy().setActionBinding(notif);
                        return context.executeAction('/SAPAssetManager/Actions/Notifications/NotificationUpdateMalfunctionEndNav.action').then(() => {
                            context.getPageProxy().setActionBinding(oldBinding);
                            return Promise.resolve();
                        });
                    }
                }
                return Promise.resolve();
            });
        }
        return Promise.resolve();
    }

    static completeWorkOrder(context, mobileStatus, completeFunc) {
        if (!completeFunc) {
            completeFunc = this.executeCompletionStepsAfterDigitalSignature;
        }
        if (libDigSig.isWODigitalSignatureEnabled(context)) {
            // check for digital signature and device Registration
            return checkDeviceRegistration(context).then(registered => {
                if (!registered) {
                        // Needs to register and do digital signarure
                        return deviceRegistration(context).then( () => {
                            // Do digital Signature

                                // Check is was properly registered
                                return checkDeviceRegistration(context).then(deviceIsRegistered => {
                                if (deviceIsRegistered) {
                                    // do digital signarure
                                    return this.createDigitalSignatureAndCompleteOrder(context).catch(() => {
                                        return Promise.reject();
                                    });
                                } else {
                                    return this.cancelDigitalSignature(context).catch(() => {
                                        return Promise.reject();
                                    });
                                }
                            });
                        }, () => {
                            if (libDigSig.isWODigitalSignatureMandatory(context)) {
                                return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/WorkOrderMobileStatusFailureMessage.action').then(() => {
                                    return Promise.reject(false);
                                });
                            } else {
                                return isSignatureControlEnabled(context, mobileStatus).then(() => {
                                    return completeFunc(context, mobileStatus);
                                });
                            }
                        });
                } else {
                    // Has registered, needs to do digital signature
                    return this.createDigitalSignatureAndCompleteOrder(context).catch(() => {
                        return Promise.reject();
                    });
                }
            });
        } else {  
            return isSignatureControlEnabled(context, mobileStatus).then(() => {
                return completeFunc(context, mobileStatus).catch(() => {
                    return Promise.reject();
                });
            });
        }

    }

    static createDigitalSignatureAndCompleteOrder(context) {
        return context.executeAction('/SAPAssetManager/Actions/DigitalSignature/CreateDigitalSignatureNav.action').then( () => {
            return Promise.resolve();
        }, () => {
            if (libDigSig.isWODigitalSignatureOptional(context)) {
                return Promise.resolve();
            } else {
                return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/WorkOrderMobileStatusFailureMessage.action').then(() => {
                    return Promise.reject();
                });
            }
        });
    }

    static executeCompletionStepsAfterDigitalSignature(context, mobileStatus) {
        let binding = libCommon.getBindingObject(context);
        libMobile.setCompleteStatus(context); // set the status to complete when user clicks "Yes" on the Work Order complete warning message
        return libThis.NotificationUpdateMalfunctionEnd(context, binding).then(() => { //Capture malfunction end date if breakdown set
            if (libMobile.isHeaderStatusChangeable(context)) { //Handle clock out create for work order
                if (libClock.isBusinessObjectClockedIn(context)) {  //Only clock out if this object is clocked in
                    libClock.setClockOutWorkOrderODataValues(context);
                    let odataDate = new ODataDate();
                    return context.executeAction({'Name': '/SAPAssetManager/Actions/ClockInClockOut/WorkOrderClockInOut.action', 'Properties': {
                        'Properties': {
                            'RecordId': generateGUID(),
                            'UserGUID': libCommon.getUserGuid(context),
                            'OperationNo': '',
                            'SubOperationNo': '',
                            'OrderId': binding.OrderId,
                            'PreferenceGroup': libClock.isCICOEnabled(context) ? 'CLOCK_OUT' : 'END_TIME',
                            'PreferenceName': binding.OrderId,
                            'PreferenceValue': odataDate.toDBDateTimeString(context),
                            'UserId': libCommon.getSapUserName(context),
                        },
                        'Headers': {
                            'OfflineOData.RemoveAfterUpload': 'false',
                        },
                        'CreateLinks': [{
                            'Property': 'WOHeader_Nav',
                            'Target':
                            {
                                'EntitySet': 'MyWorkOrderHeaders',
                                'ReadLink': "MyWorkOrderHeaders('" + binding.OrderId + "')",
                            },
                        }],
                    }}).then(() => {
                        return libThis.updateCompleteStatus(context, mobileStatus).then(() => {
                            return libClock.reloadUserTimeEntries(context);
                        });
                    }).catch(err => {
                        context.dismissActivityIndicator();
                        /**Implementing our Logger class*/
                        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryWorkOrders.global').getValue(), err);
                        return '';
                    });
                } else {
                    return libThis.updateCompleteStatus(context, mobileStatus).then(() => {
                        return libClock.reloadUserTimeEntries(context);
                    });
                }
            }
            return Promise.resolve();
        }).catch(err => {
            context.dismissActivityIndicator();
            /**Implementing our Logger class*/
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryWorkOrders.global').getValue(), err);
            return '';
        });
    }

    static setCaption(context, status) {
        //We don't need to set the toolbar caption if we are coming from a context menu swipe of a list screen.
        if (libCommon.isDefined(libCommon.getStateVariable(context, 'contextMenuSwipePage'))) {
            return;
        }

        switch (status) {
            case 'Start':
                if (typeof context.setToolbarItemCaption !== 'function') {
                    context = context.getPageProxy();
                }
                if (libClock.isCICOEnabled(context)) { //Handle clock in/out feature
                    context.setToolbarItemCaption('IssuePartTbI', context.localizeText('clock_out'));
                } else {
                    context.setToolbarItemCaption('IssuePartTbI', context.localizeText('end_workorder'));
                }
                break;
            case 'Hold':
                if (libClock.isCICOEnabled(context)) { //Handle clock in/out feature
                    context.setToolbarItemCaption('IssuePartTbI', context.localizeText('clock_in'));
                } else {
                    context.setToolbarItemCaption('IssuePartTbI', context.localizeText('start_workorder'));
                }
                break;
            case 'Transfer':
                context.setToolbarItemCaption('IssuePartTbI', context.localizeText('transferred'));
                break;
            case 'Complete':
                context.setToolbarItemCaption('IssuePartTbI', context.localizeText('completed'));
                break;
            case 'Review':
                    context.setToolbarItemCaption('IssuePartTbI', context.localizeText('restart_workorder'));
                    break;
            case 'Rejected':
                context.setToolbarItemCaption('IssuePartTbI', context.localizeText('edit_review'));
                break;
            default:
                context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/WorkOrderMobileStatusFailureMessage.action');
                break;
        }
    }

    static workOrderStatusPopoverMenu(context) {
        context.dismissActivityIndicator();
        if (libMobile.isHeaderStatusChangeable(context)) {
            let mobileStatus = libMobile.getMobileStatus(context.binding, context);
            let woReceived = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReceivedParameterName.global').getValue());
            let woHold = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/HoldParameterName.global').getValue());
            var woStarted = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
            let review = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReviewParameterName.global').getValue());
            let rejected = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/RejectedParameterName.global').getValue());

            //User may be clocked in to this WO locally regardless of what mobile status is set to
            //Status may have been changed by another user, so trap that here
            if (libClock.isBusinessObjectClockedIn(context)) {
                return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/WorkOrderChangeStausStartPopover.action');
            } else {
                if (mobileStatus === woReceived || mobileStatus === woHold) {
                    //This order is not started. It is currently either on hold or received status.
                    let isAnyOtherWorkOrderStartedPromise = this.isAnyWorkOrderStarted(context);
                    return isAnyOtherWorkOrderStartedPromise.then(
                        isAnyOtherWorkOrderStarted => {
                            if (isAnyOtherWorkOrderStarted) {
                                if (libCommon.isCurrentReadLinkLocal(context.binding['@odata.readLink'])) {
                                    return Promise.resolve();
                                } else {
                                    var pageContext = libMobile.getPageContext(context, 'WorkOrderDetailsPage');
                                    return IsAssignOrUnAssignEnableWorkOrder(context).then(function(result) {
                                        if (result) {
                                            return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/WorkOrderChangeStatusTransferPopover.action');
                                        }
                                        return libThis.transferWorkOrder(pageContext);
                                    });
                                }
                            } else if (mobileStatus === woReceived) {
                                if (libCommon.isCurrentReadLinkLocal(context.binding['@odata.readLink'])) {
                                    return this.startWorkOrder(context);
                                } else {
                                    return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/WorkOrderChangeStausReceivePopover.action');
                                }
                            } else if (mobileStatus === woHold) {
                                if (libCommon.isCurrentReadLinkLocal(context.binding['@odata.readLink'])) {
                                    return this.startWorkOrder(context);
                                } else {
                                    return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/WorkOrderChangeStausHoldPopover.action');
                                }
                            } else {
                                return Promise.resolve('');
                            }
                        }
                    );
                } else if (mobileStatus === woStarted) {
                    if (libClock.isCICOEnabled(context)) { //Handle clock in/out feature
                        if (context.binding.ClockSapUserName === libCommon.getSapUserName(context)) {
                            //This WO was started by current user, or user is clocked into this WO
                            return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/WorkOrderChangeStausStartPopover.action');
                        } else {
                            //This WO was started by someone else, so clock current user in and adjust mobile status
                            return WorkOrderStartStatus(context);
                        }
                    } else {
                        return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/WorkOrderChangeStausStartPopover.action');
                    }
                } else if (mobileStatus === review) {
                    context.dismissActivityIndicator();
                    return libSuper.isUserSupervisor(context).then(isSupervisor => {
                        if (isSupervisor) { //Supervisor can approve or reject the technician's work
                            return context.executeAction('/SAPAssetManager/Actions/Supervisor/MobileStatus/WorkOrderSupervisorReviewPopover.action');
                        }
                        //Tech user can restart a review status operation that has not yet been transmitted
                        if (libSuper.isSupervisorFeatureEnabled(context)) {
                            return context.executeAction('/SAPAssetManager/Actions/Supervisor/MobileStatus/WorkOrderTechnicianReviewPopover.action');
                        }
                        return false; //Feature is not enabled, so do nothing
                    });
                } else if (mobileStatus === rejected) {
                    context.dismissActivityIndicator();
                    return libSuper.isUserSupervisor(context).then(isSupervisor => {
                        if (isSupervisor) { //Supervisor can approve or reject the technician's work
                            return context.executeAction('/SAPAssetManager/Actions/Supervisor/MobileStatus/WorkOrderSupervisorRejectedPopover.action');
                        }
                        //Tech user can restart a rejected status operation to correct it
                        if (libSuper.isSupervisorFeatureEnabled(context)) {
                            let isAnyOtherWorkOrderStartedPromise = this.isAnyWorkOrderStarted(context);
                            return isAnyOtherWorkOrderStartedPromise.then(isAnyOtherWorkOrderStarted => {
                                if (isAnyOtherWorkOrderStarted) {
                                    if (libCommon.isCurrentReadLinkLocal(context.binding['@odata.readLink'])) {
                                        return true;
                                    } else {
                                        var pageContext = libMobile.getPageContext(context, 'WorkOrderDetailsPage');
                                        return this.transferWorkOrder(pageContext).then(function(result) {
                                            if (result) {
                                                this.setCaption(context.getPageProxy(), 'Transfer');
                                            }
                                            return true;
                                        });
                                    }
                                }
                                return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/WorkOrderChangeStausReceivePopover.action');
                            });
                        }
                        return false; //Feature is not enabled, so do nothing
                    });
                }
            }
        }
        return Promise.resolve('');
    }

    static showWorkOrderTransferWarningMessage(context) {
        let message = context.localizeText('transfer_workorder');
        return libMobile.showWarningMessage(context, message);
    }

    static showWorkOrderCompleteWarningMessage(context, mobileStatus) {
        return libSuper.checkReviewRequired(context, context.binding).then(review => {
            if (review) {
                return libMobile.showWarningMessage(context, context.localizeText('review_workorder_warning_message'), context.localizeText('confirm_status_change'), context.localizeText('ok'),context.localizeText('cancel'));
            }
            let reviewStatus = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReviewParameterName.global').getValue());
            let rejectedStatus = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/RejectedParameterName.global').getValue());
            if (mobileStatus && (mobileStatus === reviewStatus || mobileStatus === rejectedStatus)) {
                return libMobile.showWarningMessage(context, context.localizeText('approve_workorder_warning_message'), context.localizeText('confirm_status_change'), context.localizeText('ok'),context.localizeText('cancel'));
            }
            return libMobile.showWarningMessage(context, context.localizeText('complete_workorder'));
        });
    }

    static showWorkOrderTimesheetMessage(context) {
        let message = context.localizeText('workorder_add_timesheet_message');
        let caption = context.localizeText('time_entry');
        return libMobile.showWarningMessage(context, message, caption);
    }

    static showWorkOrderConfirmationsMessage(context) {
        let message = context.localizeText('confirmations_add_time_message');
        let caption = context.localizeText('time_entry');
        return libMobile.showWarningMessage(context, message, caption);
    }

    static headerMobileStatus(context, binding) {
        if (!binding)
            binding = context.binding;
        return Promise.resolve(libMobile.getMobileStatus(binding, context));  // the status rollup logic is removed after discussion with Kunal
    }

    static isOrderComplete(context) {
        var pageContext = context;
        try {
            pageContext = context.evaluateTargetPathForAPI('#Page:' + workOrderDetailsPage);
        } catch (error) {
            /**Implementing our Logger class*/
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryWorkOrders.global').getValue(), `isOrderComplete error: ${error}`);
        }
        return new Promise((resolve, reject) => {
            // Shim due to object cell context menu items. do not call context.binding after this point
            let binding = context.binding;
            if (context.constructor.name === 'SectionedTableProxy') {
                binding = context.getPageProxy().getExecutedContextMenuItem().getBinding();
            }
            // End shim
            try {
                var woComplete = libCommon.getAppParam(pageContext, 'MOBILESTATUS', pageContext.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
                let entitySet = binding['@odata.readLink'];
                if (binding['@odata.type'] === '#sap_mobile.MyWorkOrderOperation') {
                    entitySet = `${binding['@odata.readLink']}/WOHeader`;
                } else if (binding['@odata.type'] === '#sap_mobile.MyWorkOrderSubOperation') {
                    entitySet = `${binding['@odata.readLink']}/WorkOrderOperation/WOHeader`;
                } else if (binding['@odata.type'] === '#sap_mobile.MyWorkOrderComponent') {
                    entitySet = "MyWorkOrderHeaders('" + binding.OrderId + "')";
                }
                 /**
                 * This read needs a  work order readLink to verify if the workorder has been completed or not.
                 */
                return context.read('/SAPAssetManager/Services/AssetManager.service', entitySet, [], '$expand=OrderMobileStatus_Nav').then(function(woHeader) {
                    if (woHeader) {
                        let status = libMobile.getMobileStatus(woHeader.getItem(0), context);
                        if (status === woComplete) {
                            return resolve(true);
                        } else {
                            return resolve(false);
                        }
                    }
                    return resolve(false);
                });
            } catch (error) {
                return reject(false);
            }
        });
    }

    static getPartnerNumber(context) {
        var OrderId = libCommon.getTargetPathValue(context, '#Property:OrderId');
        var partnerFunction = PartnerFunction.getPersonnelPartnerFunction();
        var queryOptions = "$filter=(OrderId eq '" + OrderId + "' and PartnerFunction eq '" + partnerFunction + "')";
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderPartners', [], queryOptions).then(results => {
            if (results && results.length > 0) {
                return results.getItem(0).Partner;
            }
            return '';
        });
    }

    static getStartedWorkOrdersQueryOptions(context) {
        var userId = libCommon.getSapUserName(context);
        let woStarted = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
        let queryOption = "$filter=OrderMobileStatus_Nav/MobileStatus eq '" + woStarted + "'";
        if (libClock.isCICOEnabled(context)) {
            queryOption += " and OrderMobileStatus_Nav/CreateUserId eq '" + userId + "'"; //Only find work orders that we started
        }
        if (EnableFieldServiceTechnician(context)) {
            return WorkOrdersFSMQueryOption(context).then(fsmOrderTypes => {
                queryOption += ' and ' + fsmOrderTypes; // if we are on FST persona we want to check only service orders
                return queryOption;
            });
        } else {
            return Promise.resolve(queryOption);
        }
    }

    /**
     * Checks to see if at least one work order has been started from all the work orders.
     * Returns a Promise whose value is true if at least one order is in started status and false otherwise.
     * Also, sets state variable 'isAnyWorkOrderStarted' on Page 'WorkOrderDetailsPage' with the same value.
     * @param {*} context MDKPage context
     */
    static isAnyWorkOrderStarted(context) {
        var isAnyWorkOrderStarted = libCommon.getStateVariable(context, 'isAnyWorkOrderStarted', 'WorkOrderDetailsPage');
        if (typeof isAnyWorkOrderStarted !== 'undefined') {
            return Promise.resolve(isAnyWorkOrderStarted);
        } else {
            return this.getStartedWorkOrdersQueryOptions(context).then(queryOption => {
                isAnyWorkOrderStarted = false;
                 // Get number of Work Order that are started
                let didAnyWorkOrderStarted = context.count('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderHeaders', queryOption).then(count => {
                    return count > 0;
                });
                return Promise.all([didAnyWorkOrderStarted]).then(results => {
                    isAnyWorkOrderStarted = results[0]; // Assign the variable with the count result. Will be true if count > 0 and false otherwise
                    if (!isAnyWorkOrderStarted) {
                        return libClock.isUserClockedIn(context).then(clockedIn => { //Check if user is clocked in
                            if (clockedIn) {
                                isAnyWorkOrderStarted = true;
                            }
                            libCommon.setStateVariable(context, 'isAnyWorkOrderStarted', isAnyWorkOrderStarted, 'WorkOrderDetailsPage');
                            return isAnyWorkOrderStarted;
                        });
                    } else {
                        libCommon.setStateVariable(context, 'isAnyWorkOrderStarted', isAnyWorkOrderStarted, 'WorkOrderDetailsPage');
                        return isAnyWorkOrderStarted;
                    }
                },
                error => {
                    // Implementing our Logger class
                    Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryWorkOrders.global').getValue(), error);
                    return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/WorkOrderMobileStatusFailureMessage.action');
                });
            });
        }
    }
}
