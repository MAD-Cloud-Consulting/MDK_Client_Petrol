import mobileStatusOverride from '../../MobileStatus/MobileStatusUpdateOverride';
import libCom from '../../Common/Library/CommonLibrary';
import libSuper from '../../Supervisor/SupervisorLibrary';
import libClock from '../../ClockInClockOut/ClockInClockOutLibrary';
import libWOMobile from './WorkOrderMobileStatusLibrary';
import isAssignEnableWorkOrder from '../MobileStatus/IsAssignEnableWorkOrder';
import isUnAssignOrReAssignEnableWorkOrder from '../MobileStatus/IsUnAssignOrReAssignEnableWorkOrder';
import personaLib from '../../Persona/PersonaLibrary';
import DisconnectAllowComplete from '../../Meter/DisconnectAllowComplete';
import IsPhaseModelEnabled from '../../Common/IsPhaseModelEnabled';

/**
 * Populates the Work Order Mobile Status popover
 * Popover items use MDK overrides to run associated update dialogs/actions
 * @param {IClientAPI} context MDK context (likely a toolbar item)
 * @returns {Promise<Object>} unknown
 */
export default function WorkOrderChangeStatusPopover(context) {
    const cicoEnabled = libClock.isCICOEnabled(context);
    const STARTED = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
    const COMPLETE = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
    const TRANSFER = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/TransferParameterName.global').getValue());
    const REVIEW = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReviewParameterName.global').getValue());
    const REJECTED = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/RejectedParameterName.global').getValue());
    const HOLD = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/HoldParameterName.global').getValue());

    libCom.removeStateVariable(context, 'MobileStatusSaveRequired');
    libCom.removeStateVariable(context, 'MobileStatusReadLinkSaveRequired');

    /**
     * Checks for supervisor feature enablement and returns role if applicable
     * @returns {Promise<String>} 'T' if Technician, 'S' if Supervisor or feature disabled
     */
    let roleCheck = function() {
        const supervisorEnabled = libSuper.isSupervisorFeatureEnabled(context);

        if (supervisorEnabled) {
            return libSuper.isUserTechnician(context).then(isTechnician => {
                if (isTechnician) {
                    return 'T';
                }
                return 'S';
            });
        } else {
            // Supervisor isn't enabled
            return Promise.resolve('S');
        }
    };

    return Promise.all([libWOMobile.isAnyWorkOrderStarted(context), roleCheck(), DisconnectAllowComplete(context)]).then(checks => {
        const anythingStarted = checks[0];
        const supervisorRole = checks[1];
        const mobileStatus = context.binding.OrderMobileStatus_Nav.MobileStatus;
        const isClockedIn = (libClock.isBusinessObjectClockedIn(context) && libClock.allowClockInOverride(context, mobileStatus));
        let entitySet = context.binding['@odata.readLink'] + '/OrderMobileStatus_Nav/OverallStatusCfg_Nav/OverallStatusSeq_Nav';
        let queryOptions = IsPhaseModelEnabled(context) ? '$expand=NextOverallStatusCfg_Nav' : `$filter=UserPersona eq '${personaLib.getActivePersona(context)}'&$expand=NextOverallStatusCfg_Nav`;

        if (isClockedIn && mobileStatus !== STARTED) { //User is clocked in, but mobile status is not STARTED because another user has changed it.  We will use the next available statuses for STARTED
            entitySet = 'EAMOverallStatusSeqs';
            let baseQuery = "OverallStatusCfg_Nav/MobileStatus eq 'STARTED' and OverallStatusCfg_Nav/ObjectType eq 'WORKORDER'";
            if (IsPhaseModelEnabled(context)) {
                queryOptions = '$expand=NextOverallStatusCfg_Nav&$filter=' + baseQuery;
            } else {
                queryOptions = "$expand=NextOverallStatusCfg_Nav&$filter=UserPersona eq '" + personaLib.getActivePersona(context) + "' and "+ baseQuery;
            }
        }

        //If CICO enabled, current Work Order is started by someone else, and nothing is clocked in, do not transition; clock in immediately
        if (!anythingStarted && mobileStatus === STARTED && (cicoEnabled && !isClockedIn)) {
            return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/WorkOrderDummyStatusToast.action'); //Need to run an action here, or MDK does not allow us to update toolbar caption
        } else {
            return libSuper.checkReviewRequired(context, context.binding).then(review => {
                // Otherwise, populate possible transitions
                return context.read('/SAPAssetManager/Services/AssetManager.service', `${context.binding['@odata.readLink']}/OrderMobileStatus_Nav`, [], '$expand=OverallStatusCfg_Nav').then(rollback => {
                    libCom.setStateVariable(context, 'PhaseModelRollbackStatus', rollback.getItem(0)); //Save the rollback state to use if necessary
                    return context.read('/SAPAssetManager/Services/AssetManager.service', entitySet, [], queryOptions).then(codes => {
                        let popoverItems = [];

                        // Go through each available next status and create a PopoverItems array
                        codes.forEach(element => {
                            let statusElement = element.NextOverallStatusCfg_Nav;
                            let transitionText;

                            // If there is a TranslationTextKey available, use that for the popover item. Otherwise, use the OverallStatusLabel.
                            if (statusElement.TransitionTextKey) {
                                transitionText = context.localizeText(statusElement.TransitionTextKey);
                            } else {
                                transitionText = statusElement.OverallStatusLabel;
                            }

                            // Add items to possible transitions list
                            if (statusElement.MobileStatus === REJECTED && element.RoleType === supervisorRole) {
                                libCom.setStateVariable(context, 'PhaseModelStatusElement', statusElement);
                                popoverItems.push({'Title': transitionText, 'OnPress': '/SAPAssetManager/Rules/Supervisor/Reject/RejectReasonPhaseModelNav.js'});
                            } else if (statusElement.MobileStatus === REVIEW && element.RoleType === supervisorRole) {
                                if (review) { //Review required for tech
                                    popoverItems.push({'Title': transitionText, 'OnPress': mobileStatusOverride(context, statusElement, 'OrderMobileStatus_Nav', '/SAPAssetManager/Rules/MobileStatus/WorkOrderMobileStatusPostUpdate.js')});
                                }
                            } else if (statusElement.MobileStatus === HOLD && (element.RoleType === supervisorRole || personaLib.isFieldServiceTechnician(context))) {
                                // Prepend warning dialog to hold status change
                                popoverItems.push({'Title': transitionText, 'OnPress': {
                                    'Name': '/SAPAssetManager/Actions/Common/GenericEndDateWarningDialog.action',
                                    'Properties': {
                                        'Title': context.localizeText('confirm_status_change'),
                                        'CancelCaption': context.localizeText('cancel'),
                                        'OnOK': mobileStatusOverride(context, statusElement, 'OrderMobileStatus_Nav', '/SAPAssetManager/Rules/MobileStatus/WorkOrderMobileStatusPostUpdate.js'),
                                    },
                                }});
                            } else if (statusElement.MobileStatus === COMPLETE && (element.RoleType === supervisorRole || personaLib.isFieldServiceTechnician(context))) {
                                if (supervisorRole === 'S' || (supervisorRole === 'T' && !review) && checks[2]) { //Allow complete if supervisor or if technician and WO does not require review, and all meter disconnections are done
                                    // Prepend warning dialog to complete status change
                                    popoverItems.push({'Title': transitionText, 'OnPress': '/SAPAssetManager/Rules/WorkOrders/NavOnCompleteWorkOrderPage.js'});
                                }
                            } else if (statusElement.MobileStatus === TRANSFER && (element.RoleType === supervisorRole || personaLib.isFieldServiceTechnician(context))) {
                                // Prepend warning dialog to transfer status change
                                popoverItems.push({'Title': transitionText, 'OnPress': '/SAPAssetManager/Actions/WorkOrders/WorkOrderTransferNav.action',
                                });
                            } else {
                                // Add all other items to possible transitions as-is
                                // Omit Started if other work orders have been started
                                // Omit statuses not relevant to current role
                                if (!(statusElement.MobileStatus === STARTED && anythingStarted) && (element.RoleType === supervisorRole || personaLib.isFieldServiceTechnician(context))) {
                                    popoverItems.push({'Title': transitionText, 'OnPress': mobileStatusOverride(context, statusElement, 'OrderMobileStatus_Nav', '/SAPAssetManager/Rules/MobileStatus/WorkOrderMobileStatusPostUpdate.js')});
                                }
                            }
                        });

                        //Add supervisor role assignment options (These are not data driven currently)
                        return Promise.all([isAssignEnableWorkOrder(context), isUnAssignOrReAssignEnableWorkOrder(context)]).then(assignResults => {
                            const assign = assignResults[0];
                            const unassign = assignResults[1];

                            if (assign) {
                                popoverItems.push({'Title': '$(L,assign)', 'OnPress': '/SAPAssetManager/Rules/Supervisor/Assign/WorkOrderAssignNav.js'});
                            }
                            if (unassign) {
                                popoverItems.push({'Title': '$(L,unassign)', 'OnPress': '/SAPAssetManager/Rules/Supervisor/UnAssign/WorkOrderUnAssignNav.js'});
                                popoverItems.push({'Title': '$(L,reassign)', 'OnPress': '/SAPAssetManager/Rules/Supervisor/ReAssign/WorkOrderReAssignNav.js'});
                            }

                            // Only build and show popover if there are multiple status transitions available
                            // Exception: Show popover with one item if role is supervisor and current status is REJECTED
                            if (popoverItems.length > 1 || (supervisorRole === 'S' && mobileStatus === REJECTED)) {
                                return context.executeAction({
                                    'Name': '/SAPAssetManager/Actions/MobileStatus/MobileStatusTransitionPopover.action',
                                    'Properties': {
                                        'PopoverItems' : popoverItems,
                                    },
                                });
                            } else if (popoverItems.length === 1) {
                                // If only one status transition is available, immediately execute that action instead of showing a popover
                                return context.executeAction(popoverItems[0].OnPress);
                            } else {
                                return Promise.resolve();
                            }
                        });
                    });
                });
            });
        }
    });
}
