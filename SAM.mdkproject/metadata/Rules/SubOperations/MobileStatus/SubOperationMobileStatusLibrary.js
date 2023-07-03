import libMobile from '../../MobileStatus/MobileStatusLibrary';
import libCommon from '../../Common/Library/CommonLibrary';
import Logger from '../../Log/Logger';
import HideActionItems from '../../Common/HideActionItems';
import isTimeSheetsEnabled from '../../TimeSheets/TimeSheetsIsEnabled';
import isConfirmationsEnabled from '../../Confirmations/ConfirmationsIsEnabled';
import confirmationsCreateUpdateNav from '../../Confirmations/CreateUpdate/ConfirmationCreateUpdateNav';
import CompleteSubOperationMobileStatusAction from './CompleteSubOperationMobileStatusAction';
import UnconfirmSubOperationMobileStatusAction from './UnconfirmSubOperationMobileStatusAction';
import libClock from '../../ClockInClockOut/ClockInClockOutLibrary';
import authorizedConfirmationCreate from '../../UserAuthorizations/Confirmations/EnableConfirmationCreate';
import authorizedTimeSheetCreate from '../../UserAuthorizations/TimeSheets/EnableTimeSheetCreate';
import libWOStatus from '../../WorkOrders/MobileStatus/WorkOrderMobileStatusLibrary';
import isSignatureControlEnabled from '../../SignatureControl/SignatureControlViewPermission';
import {GlobalVar} from '../../Common/Library/GlobalCommon';
import ODataDate from '../../Common/Date/ODataDate';
import OffsetODataDate from '../../Common/Date/OffsetODataDate';
import GenerateConfirmationCounter from '../../Confirmations/CreateUpdate/OnCommit/GenerateConfirmationCounter';
import GenerateLocalConfirmationNumber from '../../Confirmations/CreateUpdate/OnCommit/GenerateLocalConfirmationNum';
import mobileStatusHistoryEntryCreate from '../../MobileStatus/MobileStatusHistoryEntryCreate';
import mobileStatusEAMObjectType from '../../MobileStatus/MobileStatusEAMObjectType';
import libThis from './SubOperationMobileStatusLibrary';
import SubOperationFSMQueryOption from '../SubOperationFSMQueryOption';
import EnableFieldServiceTechnician from '../../SideDrawer/EnableFieldServiceTechnician';
import generateGUID from '../../Common/guid';
import libAutoSync from '../../ApplicationEvents/AutoSync/AutoSyncLibrary';
const subOperationDetailsPage = 'SubOperationDetailsPage';

export default class {


    static showTimeCaptureMessage(context, isFinalRequired = false) {

        if (isConfirmationsEnabled(context) && authorizedConfirmationCreate(context)) {
            return this.showConfirmationsCaptureMessage(context, isFinalRequired);
        } else if (isTimeSheetsEnabled(context) && authorizedTimeSheetCreate(context)) {
            return this.showTimeSheetCaptureMessage(context, isFinalRequired);
        }
        return Promise.resolve(true);
    }

    static showConfirmationsCaptureMessage(context, isFinalRequired = false) {
        return this.showWorkOrderConfirmationMessage(context).then(didSelectOk => {
            if (!didSelectOk) {
                if (isFinalRequired) {
                    let ConfirmationNum = GenerateLocalConfirmationNumber(context);
                    let ConfirmationCounter = GenerateConfirmationCounter(context);
                    return Promise.all([ConfirmationNum, ConfirmationCounter]).then((resolvedValues) => {
                        let binding = context.binding;
                        let odataDate = new ODataDate();
                        let currentDate = odataDate.toDBDateString(context);
                        let currentTime = odataDate.toDBTimeString(context);
                        return context.executeAction({'Name': '/SAPAssetManager/Actions/Confirmations/ConfirmationCreateBlank.action', 'Properties': {
                            'Properties':
                            {
                                'ConfirmationNum': resolvedValues[0],
                                'ConfirmationCounter': resolvedValues[1],
                                'FinalConfirmation': 'X',
                                'OrderID': binding.OrderId,
                                'Operation': binding.OperationNo,
                                'SubOperation': binding.SubOperationNo,
                                'StartDate': currentDate,
                                'StartTime': currentTime,
                                'FinishDate': currentDate,
                                'FinishTime': currentTime,
                                'Plant': binding.Plant || binding.MainWorkCenterPlant,

                            },
                            'Headers': {
                                'OfflineOData.RemoveAfterUpload': true,
                                'OfflineOData.TransactionID': resolvedValues[0],
                            },
                            'CreateLinks': [{
                                'Property': 'WorkOrderHeader',
                                'Target': {
                                    'EntitySet': 'MyWorkOrderHeaders',
                                    'ReadLink': `MyWorkOrderHeaders('${binding.OrderId}')`,
                                },
                            },
                            {
                                'Property': 'WorkOrderOperation',
                                'Target': {
                                    'EntitySet': 'MyWorkOrderOperations',
                                    'ReadLink': `MyWorkOrderOperations(OrderId='${binding.OrderId}',OperationNo='${binding.OperationNo}')`,
                                },
                            }],
                        }});
                    }).catch(() => {
                        return Promise.resolve(true);
                    });
                } else {
                    return Promise.resolve(true);
                }
            }
            let startDate = libCommon.getStateVariable(context, 'StatusStartDate');
            let endDate = libCommon.getStateVariable(context, 'StatusEndDate');
            let binding = libCommon.getBindingObject(context);

            let overrides = {
                'IsWorkOrderChangable': false,
                'IsOperationChangable': false,
                'IsSubOperationChangable': false,
                'OrderID': binding.OrderId,
                'WorkOrderHeader': binding.WorkOrderOperation.WOHeader,
                'Operation': binding.OperationNo,
                'SubOperation': binding.SubOperationNo,
                'MobileStatus': binding.MobileStatus,
                'WorkOrderOperation': binding.WorkOrderOperation,
                'IsFinalChangable': false,
                'Plant' : binding.MainWorkCenterPlant,
                'doCheckSubOperationComplete' : false,
                'doCheckOperationComplete': false,
                'doCheckWorkOrderComplete': false,
                'OperationActivityType': binding.ActivityType,
            };

            if (isFinalRequired) {
                overrides.IsFinal = true;
            }

            return confirmationsCreateUpdateNav(context, overrides, startDate, endDate).then(() => {
                return Promise.resolve(true);
            });
        });
    }

    static showTimeSheetCaptureMessage(context, isFinalRequired=false) {
        return this.showWorkOrderTimesheetMessage(context).then(doSetComplete => {
            if (doSetComplete) {
                return context.executeAction('/SAPAssetManager/Actions/TimeSheets/TimeSheetEntryCreateForWONav.action');
            }
            return Promise.resolve();
        }, error => {
            /**Implementing our Logger class*/
            context.dismissActivityIndicator();
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySubOperations.global').getValue(), error);
            return context.executeAction('/SAPAssetManager/Actions/WorkOrders/SubOperations/SubOperationMobileStatusFailureMessage.action');
        }).then(() => {
            if (isFinalRequired) {
                let ConfirmationNum = GenerateLocalConfirmationNumber(context);
                let ConfirmationCounter = GenerateConfirmationCounter(context);
                return Promise.all([ConfirmationNum, ConfirmationCounter]).then((resolvedValues) => {
                    let binding = context.binding;
                    let odataDate = new ODataDate();
                    let currentDate = odataDate.toDBDateString(context);
                    let currentTime = odataDate.toDBTimeString(context);
                    return context.executeAction({'Name': '/SAPAssetManager/Actions/Confirmations/ConfirmationCreateBlank.action', 'Properties': {
                        'Properties':
                        {
                            'ConfirmationNum': resolvedValues[0],
                            'ConfirmationCounter': resolvedValues[1],
                            'FinalConfirmation': 'X',
                            'OrderID': binding.OrderId,
                            'Operation': binding.OperationNo,
                            'SubOperation': binding.SubOperationNo || '',
                            'StartDate': currentDate,
                            'StartTime': currentTime,
                            'FinishDate': currentDate,
                            'FinishTime': currentTime,
                            'Plant': binding.Plant || binding.MainWorkCenterPlant,

                        },
                        'Headers': {
                            'OfflineOData.RemoveAfterUpload': true,
                            'OfflineOData.TransactionID': resolvedValues[0],
                        },
                        'CreateLinks': [{
                            'Property': 'WorkOrderHeader',
                            'Target': {
                                'EntitySet': 'MyWorkOrderHeaders',
                                'ReadLink': `MyWorkOrderHeaders('${binding.OrderId}')`,
                            },
                        },
                        {
                            'Property': 'WorkOrderOperation',
                            'Target': {
                                'EntitySet': 'MyWorkOrderOperations',
                                'ReadLink': `MyWorkOrderOperations(OrderId='${binding.OrderId}',OperationNo='${binding.OperationNo}')`,
                            },
                        }],
                    }});
                }).catch(() => {
                    return Promise.resolve(true);
                });
            } else {
                return Promise.resolve(true);
            }
        });
    }


    static startSubOperation(context) {
        let pageContext = context;
        if (typeof context.setToolbarItemCaption !== 'function') {
            pageContext = context.getPageProxy();
        }
        let binding = libCommon.getBindingObject(context);
        var odataDate = new ODataDate();
        const eamObjType = mobileStatusEAMObjectType(context);
        const mobileStatus = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
        libCommon.setStateVariable(context, 'StatusStartDate', odataDate.date());
        libMobile.setStartStatus(context);
        let properties = {
            'ObjectKey': (function() {
                var objectKey = '';
                //If not a local sub-operation, it will have an ObjectKey value
                if (binding.ObjectKey) {
                    objectKey = binding.ObjectKey;
                } else if (binding.SubOpMobileStatus_Nav.ObjectKey) {
                    //For local sub-operations, we get the local ObjectKey from PMMobileStatuses record.
                    objectKey = binding.SubOpMobileStatus_Nav.ObjectKey;
                }
                return objectKey;
            })(),
            'ObjectType': GlobalVar.getAppParam().OBJECTTYPE.SubOperation,
            'MobileStatus': mobileStatus,
            'EffectiveTimestamp': odataDate.toDBDateTimeString(context),
            'CreateUserGUID': libCommon.getUserGuid(context),
            'CreateUserId': libCommon.getSapUserName(context),
        };
        return context.executeAction({'Name': '/SAPAssetManager/Actions/WorkOrders/SubOperations/SubOperationMobileStatusStartUpdate.action', 'Properties': {
            'Properties': properties,
            'Target': {
                'EntitySet': 'PMMobileStatuses',
                'Service': '/SAPAssetManager/Services/AssetManager.service',
                'ReadLink' : binding.SubOpMobileStatus_Nav['@odata.readLink'],
            },
            'UpdateLinks': [{
                'Property': 'OverallStatusCfg_Nav',
                'Target': {
                    'EntitySet': 'EAMOverallStatusConfigs',
                    'QueryOptions': `$filter=MobileStatus eq '${mobileStatus}' and ObjectType eq '${eamObjType}'`,
                },
            }],
        }}).then(() => {
            return mobileStatusHistoryEntryCreate(context, properties, binding.SubOpMobileStatus_Nav['@odata.readLink']);
        }).then(function() {

            //Handle clock in create for sub-operation
            libClock.setClockInSubOperationODataValues(context);
            if (context.constructor.name !== 'SectionedTableProxy') {
                pageContext.setToolbarItemCaption('IssuePartTbI', context.localizeText('end_suboperation'));
            }
            return context.executeAction({'Name': '/SAPAssetManager/Actions/ClockInClockOut/WorkOrderClockInOut.action', 'Properties': {
                'Properties': {
                    'RecordId': generateGUID(),
                    'UserGUID': libCommon.getUserGuid(context),
                    'OperationNo': binding.OperationNo,
                    'SubOperationNo': binding.SubOperationNo,
                    'OrderId': binding.OrderId,
                    'PreferenceGroup': 'START_TIME',
                    'PreferenceName': binding.OrderId,
                    'PreferenceValue': odataDate.toDBDateTimeString(context),
                    'UserId': libCommon.getSapUserName(context),
                },
                'CreateLinks': [{
                    'Property': 'WOSubOperation_Nav',
                    'Target':
                    {
                        'EntitySet': 'MyWorkOrderSubOperations',
                        'ReadLink': "MyWorkOrderSubOperations(OrderId='" + binding.OrderId + "',OperationNo='" + binding.OperationNo + "',SubOperationNo='" + binding.SubOperationNo + "')",
                    },
                }],
            }}).then(() => {
                return context.executeAction('/SAPAssetManager/Actions/WorkOrders/SubOperations/SubOperationMobileStatusSuccessMessage.action');
            });
        });
    }

    static changeSubOperationStatusFSM(context, status) {
        let binding = libCommon.getBindingObject(context);
        var odataDate = new ODataDate();
        const eamObjType = mobileStatusEAMObjectType(context);
        const properties = {
            'ObjectKey': (function() {
                var objectKey = '';
                //If not a local sub-operation, it will have an ObjectKey value
                if (binding.ObjectKey) {
                    objectKey = binding.ObjectKey;
                } else if (binding.SubOpMobileStatus_Nav.ObjectKey) {
                    //For local sub-operations, we get the local ObjectKey from PMMobileStatuses record.
                    objectKey = binding.SubOpMobileStatus_Nav.ObjectKey;
                }
                return objectKey;
            })(),
            'ObjectType': GlobalVar.getAppParam().OBJECTTYPE.SubOperation,
            'MobileStatus': status,
            'EffectiveTimestamp': odataDate.toDBDateTimeString(context),
            'CreateUserGUID': libCommon.getUserGuid(context),
            'CreateUserId': libCommon.getSapUserName(context),
        };
        
        return context.executeAction({
            'Name': '/SAPAssetManager/Actions/MobileStatus/MobileStatusUpdate.action', 'Properties': {
                'Properties': properties,
                'Target': {
                    'EntitySet': 'PMMobileStatuses',
                    'Service': '/SAPAssetManager/Services/AssetManager.service',
                    'ReadLink' : binding.SubOpMobileStatus_Nav['@odata.readLink'],
                },
                'Headers': {
                    'OfflineOData.NonMergeable': true,
                },
                'UpdateLinks': [{
                    'Property': 'OverallStatusCfg_Nav',
                    'Target':
                    {
                        'EntitySet': 'EAMOverallStatusConfigs',
                        'QueryOptions': `$filter=MobileStatus eq '${status}' and ObjectType eq '${eamObjType}'`,
                    },
                }],
            },
        }).then(() => {
            const rejected = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/RejectedParameterName.global').getValue());
            const accepted = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/AcceptedParameterName.global').getValue());
            const travel = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/TravelParameterName.global').getValue());
            const onsite = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/OnsiteParameterName.global').getValue());
            
            if (status === accepted) {
                libMobile.setAcceptedStatus(context);
            } else if (status === travel) {
                libMobile.setTravelStatus(context);
            } else if (status === onsite) {
                libMobile.setOnsiteStatus(context);
            } else if (status === rejected) {
                libMobile.setRejectedStatus(context);
            }
            return Promise.resolve(true);
        }).then(() => {
            return mobileStatusHistoryEntryCreate(context, properties, binding.SubOpMobileStatus_Nav['@odata.readLink']);
        }).then(() => {
            return context.executeAction('/SAPAssetManager/Actions/WorkOrders/SubOperations/SubOperationMobileStatusSuccessMessage.action');
        }).then(() =>{
            return libAutoSync.autoSyncOnStatusChange(context);
        });
    }

    static holdSubOperation(context) {
        let binding = libCommon.getBindingObject(context);
        const eamObjType = mobileStatusEAMObjectType(context);
        const mobileStatus = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/HoldParameterName.global').getValue());
        return this.showSubOperationHoldWarningMessage(context).then(
            result => {
                if (result) {
                    libMobile.setHoldStatus(context);
                    return context.read('/SAPAssetManager/Services/AssetManager.service', `${binding['@odata.readLink']}/SubOpMobileStatus_Nav`, [], '').then(results => {
                        let odataDate;
                        if (results && results.getItem(0)) {
                            var status = results.getItem(0);
                            if (status) {
                                odataDate = OffsetODataDate(context, status.EffectiveTimestamp);
                                libCommon.setStateVariable(context, 'StatusStartDate', odataDate.date());
                            }
                        }
                        odataDate = new ODataDate();
                        libCommon.setStateVariable(context, 'StatusEndDate', odataDate.date());
                        return odataDate.toDBDateTimeString(context);
                    }).then((datetime) => {
                        let properties = {
                            'ObjectKey': (function() {
                                var objectKey = '';
                                //If not a local sub-operation, it will have an ObjectKey value
                                if (binding.ObjectKey) {
                                    objectKey = binding.ObjectKey;
                                } else if (binding.SubOpMobileStatus_Nav.ObjectKey) {
                                    //For local sub-operations, we get the local ObjectKey from PMMobileStatuses record.
                                    objectKey = binding.SubOpMobileStatus_Nav.ObjectKey;
                                }
                                return objectKey;
                            })(),
                            'ObjectType': GlobalVar.getAppParam().OBJECTTYPE.SubOperation,
                            'MobileStatus': mobileStatus,
                            'EffectiveTimestamp': datetime,
                            'CreateUserGUID': libCommon.getUserGuid(context),
                            'CreateUserId': libCommon.getSapUserName(context),
                        };
                        return context.executeAction({'Name': '/SAPAssetManager/Actions/WorkOrders/SubOperations/SubOperationMobileStatusHoldUpdate.action', 'Properties': {
                            'Properties': properties,
                            'Target': {
                                'EntitySet': 'PMMobileStatuses',
                                'Service': '/SAPAssetManager/Services/AssetManager.service',
                                'ReadLink' : binding.SubOpMobileStatus_Nav['@odata.readLink'],
                            },
                            'UpdateLinks': [{
                                'Property': 'OverallStatusCfg_Nav',
                                'Target':
                                {
                                    'EntitySet': 'EAMOverallStatusConfigs',
                                    'QueryOptions': `$filter=MobileStatus eq '${mobileStatus}' and ObjectType eq '${eamObjType}'`,
                                },
                            }],
                        }}).then(() => {
                            return mobileStatusHistoryEntryCreate(context, properties, binding.SubOpMobileStatus_Nav['@odata.readLink']);
                        }).then(() => {
                            return datetime;
                        });
                    }).then(function(datetime) {
                        //Handle clock out create for sub-operation
                        libClock.setClockOutSubOperationODataValues(context);
                        return context.executeAction({'Name': '/SAPAssetManager/Actions/ClockInClockOut/WorkOrderClockInOut.action', 'Properties': {
                            'Properties': {
                                'RecordId': generateGUID(),
                                'UserGUID': libCommon.getUserGuid(context),
                                'OperationNo': binding.OperationNo,
                                'SubOperationNo': binding.SubOperationNo,
                                'OrderId': binding.OrderId,
                                'PreferenceGroup': 'END_TIME',
                                'PreferenceName': binding.OrderId,
                                'PreferenceValue': datetime,
                                'UserId': libCommon.getSapUserName(context),
                            },
                            'CreateLinks': [{
                                'Property': 'WOSubOperation_Nav',
                                'Target':
                                {
                                    'EntitySet': 'MyWorkOrderSubOperations',
                                    'ReadLink': "MyWorkOrderSubOperations(OrderId='" + binding.OrderId + "',OperationNo='" + binding.OperationNo + "',SubOperationNo='" + binding.SubOperationNo + "')",
                                },
                            }],
                        }}).then(() => {
                            if (context.constructor.name !== 'SectionedTableProxy') {
                                context.setToolbarItemCaption('IssuePartTbI', context.localizeText('start_suboperation'));
                            }
                            return libThis.showTimeCaptureMessage(context);
                        });
                    });
                } else {
                    return Promise.resolve();
                }
            });
    }

    static transferSubOperation(context) {
        libMobile.setTransferStatus(context);
        return this.showSubOperationTransferWarningMessage(context);
    }

    static completeSubOperationWithoutTime(context, mobileStatus) {
        let promises = [];

        if (libMobile.isSubOperationStatusChangeable(context)) {
            promises.push(isSignatureControlEnabled(context, mobileStatus));
        }

        return Promise.all(promises).then(() => {
            return libMobile.NotificationUpdateMalfunctionEnd(context, context.binding);
        });
    }

    static completeSubOperation(context, mobileStatus) {
        var pageContext = libMobile.getPageContext(context, subOperationDetailsPage);
        let promises = [];
        return this.showSubOperationCompleteWarningMessage(pageContext).then(
            doSetComplete => {
                if (!doSetComplete) {
                    // Return early, user elected to not complete this operation
                    return true;
                }
                if (libMobile.isSubOperationStatusChangeable(context)) {
                    promises.push(isSignatureControlEnabled(context, mobileStatus));
                }
                return Promise.all(promises).then(() => {
                    // Setup the SubOperation action
                    let binding = libCommon.getBindingObject(context);
                    let actionArgs = {
                        SubOperationId: binding.SubOperationNo,
                        OperationId: binding.OperationNo,
                        WorkOrderId: binding.OrderId,
                        isSubOperationStatusChangeable: libMobile.isSubOperationStatusChangeable(context),
                        isOperationStatusChangeable: libMobile.isOperationStatusChangeable(context),
                        isHeaderStatusChangeable: libMobile.isHeaderStatusChangeable(context),
                    };
                    return libWOStatus.NotificationUpdateMalfunctionEnd(context, binding.WorkOrderOperation.WOHeader).then(() => { //Capture malfunction end date if breakdown set
                        return libThis.showTimeCaptureMessage(pageContext, false).then(() => {
                            if (libMobile.isSubOperationStatusChangeable(context)) { //Handle clock out create for sub-operation
                                libClock.setClockOutSubOperationODataValues(context);
                                promises.push(context.executeAction(
                                    { 'Name': '/SAPAssetManager/Actions/ClockInClockOut/WorkOrderClockInOut.action', 'Properties': {
                                        'Properties': {
                                            'RecordId': generateGUID(),
                                            'UserGUID': libCommon.getUserGuid(context),
                                            'OperationNo': binding.OperationNo,
                                            'SubOperationNo': binding.SubOperationNo,
                                            'OrderId': binding.OrderId,
                                            'PreferenceGroup': 'END_TIME',
                                            'PreferenceName': binding.OrderId,
                                            'PreferenceValue': new ODataDate().toDBDateTimeString(context),
                                            'UserId': libCommon.getSapUserName(context),
                                        },
                                        'CreateLinks': [{
                                            'Property': 'WOSubOperation_Nav',
                                            'Target':
                                            {
                                                'EntitySet': 'MyWorkOrderSubOperations',
                                                'ReadLink': "MyWorkOrderSubOperations(OrderId='" + binding.OrderId + "',OperationNo='" + binding.OperationNo + "',SubOperationNo='" + binding.SubOperationNo + "')",
                                            },
                                        }],
                                    }}
                                ));
                            }
                            return Promise.all(promises).then(() => {
                                actionArgs.didCreateFinalConfirmation = libCommon.getStateVariable(context, 'IsFinalConfirmation', libCommon.getPageName(context));
                                let action = new CompleteSubOperationMobileStatusAction(actionArgs);
                                pageContext.getClientData().confirmationArgs = {
                                    doCheckSubOperationComplete: false,
                                    doCheckOperationComplete: false,
                                };
                                // Add this action to client data for retrieval as needed
                                pageContext.getClientData().mobileStatusAction = action;
                                return action.execute(pageContext).then(() => {
                                    return libThis.didSetSubOperationCompleteWrapper(pageContext).then(() => {
                                        return libAutoSync.autoSyncOnStatusChange(context);
                                    });
                                });
                            });

                        }, (error) => {
                            /**Implementing our Logger class*/
                            pageContext.dismissActivityIndicator();
                            Logger.error(pageContext.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySubOperations.global').getValue(), error);
                            pageContext.executeAction('/SAPAssetManager/Actions/WorkOrders/SubOperations/SubOperationMobileStatusFailureMessage.action');
                            return Promise.reject(error);
                        });
                    });
                });
            });
    }

    static unconfirmSubOperation(context) {
        let pageContext = libMobile.getPageContext(context, subOperationDetailsPage);
        let parent = this;

        return this.showUnconfirmSubOperationWarningMessage(context).then(
            doMarkUnconfirm => {
                if (!doMarkUnconfirm) {
                    //User chose not to unconfirm operation
                    return '';
                }

                let binding = pageContext.getBindingObject();
                if (context.constructor.name === 'SectionedTableProxy') {
                    binding = context.getPageProxy().getExecutedContextMenuItem().getBinding();
                }
                let actionArgs = {
                    OperationId: binding.OperationNo,
                    WorkOrderId: binding.OrderId,
                    SubOperationId: binding.SubOperationNo,
                };

                let action = new UnconfirmSubOperationMobileStatusAction(actionArgs);
                // Add this action to client data for retrieval as needed
                pageContext.getClientData().mobileStatusAction = action;

                return action.execute(pageContext).then(() => {
                    return parent.didSetSubOperationUnconfirm(pageContext).then(() => {
                        return libAutoSync.autoSyncOnStatusChange(context);
                    });
                }, () => {
                    return pageContext.executeAction('/SAPAssetManager/Actions/WorkOrders/SubOperations/SubOperationUnconfirmFailureMessage.action');
                });

            }
        );
    }

    static showUnconfirmSubOperationWarningMessage(context) {
        return libMobile.showWarningMessage(context, context.localizeText('unconfirm_suboperation_warning_message'));
    }

    static didSetSubOperationCompleteWrapper(context) {
        if (libMobile.isSubOperationStatusChangeable(context)) {
            return this.didSetSubOperationComplete(context);
        } else {
            return this.didSetSubOperationConfirm(context);
        }
    }

    static didSetSubOperationComplete(context) {
        context.setToolbarItemCaption('IssuePartTbI', context.localizeText('complete_text'));
        libCommon.enableToolBar(context, subOperationDetailsPage, 'IssuePartTbI', false);
        // Hide the toolbar items
        try {
            HideActionItems(context, 2);
        } catch (exception) {
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySubOperations.global').getValue(), `action bar refresh error: ${exception}`);
        }
        libMobile.setCompleteStatus(context);
        return context.executeAction('/SAPAssetManager/Actions/WorkOrders/SubOperations/SubOperationMobileStatusSuccessMessage.action');
    }

    static didSetSubOperationConfirm(context) {
        context.setToolbarItemCaption('IssuePartTbI', context.localizeText('unconfirm'));
        return context.executeAction('/SAPAssetManager/Actions/WorkOrders/SubOperations/SubOperationConfirmSuccessMessage.action');
    }

    static didSetSubOperationUnconfirm(context) {
        context.setToolbarItemCaption('IssuePartTbI', context.localizeText('confirm'));
        return context.executeAction('/SAPAssetManager/Actions/WorkOrders/SubOperations/SubOperationUnconfirmSuccessMessage.action');
    }

    // eslint-disable-next-line consistent-return
    static subOperationStatusPopoverMenu(context) {
        var started = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());

        //Change sub-operation status when assignment type is at work order header level.
        if (libMobile.isHeaderStatusChangeable(context)) {
            let workOrderMobileStatus = libMobile.getMobileStatus(context.binding.WorkOrderOperation.WOHeader, context);
            if (workOrderMobileStatus === started) {
                return libMobile.isMobileStatusConfirmed(context, context.binding.SubOperationNo).then(result => {
                    if (result) {
                        return this.unconfirmSubOperation(context);
                    } else {
                        return this.completeSubOperation(context);
                    }
                });
            }
            context.dismissActivityIndicator();
            return libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
        }

        //Change sub-operation status when assignment type is at operation level.
        if (libMobile.isOperationStatusChangeable(context)) {
            let operationMobileStatus = libMobile.getMobileStatus(context.binding.WorkOrderOperation, context);
            if (operationMobileStatus === started) {
                return libMobile.isMobileStatusConfirmed(context, context.binding.SubOperationNo).then(result => {
                    if (result) {
                        return this.unconfirmSubOperation(context);
                    } else {
                        return this.completeSubOperation(context);
                    }
                });
            }
            context.dismissActivityIndicator();
            return libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
        }

        if (libMobile.isSubOperationStatusChangeable(context)) {
            var parent = this;
            var received = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReceivedParameterName.global').getValue());
            var hold = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/HoldParameterName.global').getValue());
            let mobileStatus = libMobile.getMobileStatus(context.binding, context);
            if (mobileStatus === received || mobileStatus === hold) {
                //This sub-operation is not started. It is currently either on hold or received status.
                let isAnyOtherOperationStartedPromise = this.isAnySubOperationStarted(context);
                return isAnyOtherOperationStartedPromise.then(
                    isAnyOtherOperationStarted => {
                        if (isAnyOtherOperationStarted) {
                            var pageContext = libMobile.getPageContext(context, subOperationDetailsPage);
                            return this.transferSubOperation(pageContext);
                        } else if (mobileStatus === received || mobileStatus === hold) {
                            context.dismissActivityIndicator();
                            if (libCommon.isCurrentReadLinkLocal(context.binding['@odata.readLink'])) {
                                return parent.startSubOperation(context);
                            } else {
                                return context.executeAction('/SAPAssetManager/Actions/WorkOrders/SubOperations/SubOperationChangeStausReceivePopover.action');
                            }
                        } else {
                            context.dismissActivityIndicator();
                            return Promise.resolve('');
                        }
                    }
                );
            } else if (mobileStatus === started) {
                context.dismissActivityIndicator();
                return context.executeAction('/SAPAssetManager/Actions/WorkOrders/SubOperations/SubOperationChangeStausStartPopover.action');
            }
        }

        context.dismissActivityIndicator();
        return Promise.resolve('');
    }

    static showSubOperationTransferWarningMessage(context) {
        let message = context.localizeText('transfer_suboperation');
        return libMobile.showWarningMessage(context, message).then(bool => {
            if (bool) {
                return context.executeAction('/SAPAssetManager/Actions/WorkOrders/SubOperations/SubOperationTransferNav.action');
            } else {
                return Promise.resolve(false);
            }
        });
    }

    static showSubOperationCompleteWarningMessage(context) {
        if (libMobile.isSubOperationStatusChangeable(context)) {
            return libMobile.showWarningMessage(context, context.localizeText('complete_suboperation'));
        } else {
            return libMobile.showWarningMessage(context, context.localizeText('confirm_suboperation_warning_message'));
        }
    }

    static showSubOperationHoldWarningMessage(context) {
        let message = context.localizeText('hold_suboperation_warning_message');
        return libMobile.showWarningMessage(context, message);
    }

    static showWorkOrderConfirmationMessage(context) {
        let message = context.localizeText('confirmations_add_time_message');
        return libMobile.showWarningMessage(context, message);
    }

    static showWorkOrderTimesheetMessage(context) {
        let message = context.localizeText('workorder_add_timesheet_message');
        return libMobile.showWarningMessage(context, message);
    }

    static getSubOperationMobileStatus(context) {
        var pageContext = context.evaluateTargetPathForAPI('#Page:SubOperationDetailsPage');
        return new Promise((resolve, reject) => {
            try {
                resolve(libMobile.getMobileStatus(pageContext.binding, context));
            } catch (error) {
                reject('');
            }
        });
    }

    static isSubOperationComplete(context) {
        let completed = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
        return this.getSubOperationMobileStatus(context).then(status => {
            return status === completed;
        });
    }

    static getStartedSubOperationsQueryOptions(context) {
        var userGUID = libCommon.getUserGuid(context);
        let startedStatus = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
        let queryOption = "$expand=SubOpMobileStatus_Nav&$filter=SubOpMobileStatus_Nav/MobileStatus eq '" + startedStatus + "'";
        queryOption += " and SubOpMobileStatus_Nav/CreateUserGUID eq '" + userGUID + "'"; //Only find sub-operations that we started

        if (EnableFieldServiceTechnician(context)) {
            return SubOperationFSMQueryOption(context).then(fsmTypes => {
                if (fsmTypes) {
                    queryOption += ' and ' + fsmTypes;
                }
                return queryOption;
            });
        } else {
            return Promise.resolve(queryOption);
        }
    }

    /**
     * Checks to see if at least one sub-operation has been started from all of the sub-operations of the operation.
     * Returns a Promise whose value is true if at least one sub-operation is in started status and false otherwise.
     * Also, sets state variable 'isAnySubOperationStarted' on Page 'SubOperationDetailsPage' with the same value.
     *
     * @param {*} context MDKPage context whose binding object is an operation.
     */
    static isAnySubOperationStarted(context) {
        var isAnySubOperationStarted = libCommon.getStateVariable(context, 'isAnySubOperationStarted', 'SubOperationDetailsPage');
        if (typeof isAnySubOperationStarted !== 'undefined') {
            return Promise.resolve(isAnySubOperationStarted);
        } else {
            return this.getStartedSubOperationsQueryOptions(context).then(queryOption => {
                isAnySubOperationStarted = false;
                // Only get sibling sub-operations, not all sub-operations.
                return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderSubOperations', [], queryOption).then(
                    startedSubOperationsList => {
                        if (startedSubOperationsList) {
                            var total = startedSubOperationsList.length;
                            if (total > 0) {
                                isAnySubOperationStarted = true;
                            }
                        }
                        libCommon.setStateVariable(context, 'isAnySubOperationStarted', isAnySubOperationStarted, 'SubOperationDetailsPage');
                        return isAnySubOperationStarted;
                    },
                    error => {
                        // Implementing our Logger class
                        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySubOperations.global').getValue(), error);
                        return context.executeAction('/SAPAssetManager/Actions/WorkOrders/SubOperations/SubOperationMobileStatusFailureMessage.action');
                    });
            });
        }
    }

}
