import libCommon from '../../../Common/Library/CommonLibrary';
import Logger from '../../../Log/Logger';
import libSuper from '../../../Supervisor/SupervisorLibrary';
import isTimeSheetsEnabled from '../../../TimeSheets/TimeSheetsIsEnabled';
import isConfirmationsEnabled from '../../../Confirmations/ConfirmationsIsEnabled';
import authorizedConfirmationCreate from '../../../UserAuthorizations/Confirmations/EnableConfirmationCreate';
import authorizedTimeSheetCreate from '../../../UserAuthorizations/TimeSheets/EnableTimeSheetCreate';
import confirmationsCreateUpdateNav from '../../../Confirmations/CreateUpdate/ConfirmationCreateUpdateNav';
import WorkOrderCompletionLibrary from '../WorkOrderCompletionLibrary';
import ConfirmationUpdateNav from '../../../Confirmations/CreateUpdate/ConfirmationUpdateNav';

export default function ChangeTime(context) {
    let confirm = (isConfirmationsEnabled(context) && authorizedConfirmationCreate(context));
    let timesheet = (isTimeSheetsEnabled(context) && authorizedTimeSheetCreate(context));
    
    let binding = WorkOrderCompletionLibrary.getInstance().getBinding(context);
    let mobileStatus = '';
    if (WorkOrderCompletionLibrary.getInstance().isWOFlow() && binding.OrderMobileStatus_Nav) { 
        mobileStatus = binding.OrderMobileStatus_Nav.MobileStatus;
    } else if (WorkOrderCompletionLibrary.getInstance().isOperationFlow() && binding.OperationMobileStatus_Nav) {
        mobileStatus = binding.OperationMobileStatus_Nav.MobileStatus;
    } else if (WorkOrderCompletionLibrary.getInstance().isSubOperationFlow() && binding.SubOpMobileStatus_Nav) {
        mobileStatus = binding.SubOpMobileStatus_Nav.MobileStatus;
    }

    let reviewStatus = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReviewParameterName.global').getValue());
    let rejectedStatus = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/RejectedParameterName.global').getValue());
    if (confirm) { //Check if this operation is in review status and supervisor has time flag
        if (mobileStatus && (mobileStatus === reviewStatus || mobileStatus === rejectedStatus)) {
            confirm = libSuper.isSupervisorTimeEnabled(context);
        }
    } else if (timesheet) { //Check if this operation is in review status and supervisor has time flag
        if (mobileStatus && (mobileStatus === reviewStatus || mobileStatus === rejectedStatus)) {
            timesheet = libSuper.isSupervisorTimeEnabled(context);
        }
    }

    WorkOrderCompletionLibrary.setConfirmationType(context, 'time');
    if (confirm) {
        return openConfirmationPage(context, binding);
    } else if (timesheet) {
        return openTimeEntryPage(context);
    }

    return Promise.resolve(true); 
}

function openConfirmationPage(context, binding) {
    let startDate = libCommon.getStateVariable(context, 'StatusStartDate');
    let endDate = libCommon.getStateVariable(context, 'StatusEndDate');

    let overrides = {};

    if (WorkOrderCompletionLibrary.getInstance().isWOFlow()) {
        overrides = {
            'IsWorkOrderChangable': false,
            'WorkOrderHeader': binding,
            'OrderID': binding.OrderId,
            'IsFromWorkOrderHold': binding.IsFromWorkOrderHold,
            'Plant' : binding.MainWorkCenterPlant,
            'doCheckWorkOrderComplete':false,
            'IsFinalChangable': false,
            'IsFinal': false,
        };

        if (binding.SupervisorDisallowFinal) { //Do not allow tech to change final confirmation slider on review
            binding.SupervisorDisallowFinal = '';
            overrides.IsFinalChangable = false;
        }
    } else if (WorkOrderCompletionLibrary.getInstance().isOperationFlow()) {
        overrides = {
            'IsWorkOrderChangable': false,
            'IsOperationChangable': false,
            'OrderID': binding.OrderId,
            'WorkOrderHeader': binding.WOHeader,
            'Operation': binding.OperationNo,
            'MobileStatus': binding.MobileStatus,
            'IsFinalChangable': false,
            'Plant' : binding.MainWorkCenterPlant,
            'doCheckOperationComplete' : false,
            'OperationActivityType': binding.ActivityType,
            'IsFinal': true,
            'FinalConfirmation': 'X',
        };
    } else if (WorkOrderCompletionLibrary.getInstance().isSubOperationFlow()) {
        overrides = {
            'IsWorkOrderChangable': false,
            'IsOperationChangable': false,
            'IsSubOperationChangable': false,
            'OrderID': binding.OrderId,
            'Operation': binding.OperationNo,
            'SubOperation': binding.SubOperationNo,
            'MobileStatus': binding.MobileStatus,
            'WorkOrderOperation': binding.WorkOrderOperation,
            'IsFinalChangable': false,
            'Plant' : binding.MainWorkCenterPlant,
            'doCheckSubOperationComplete' : false,
            'doCheckOperationComplete': false,
            'OperationActivityType': binding.ActivityType,
            'IsFinal': true,
            'FinalConfirmation': 'X',
        };
    }

    if (WorkOrderCompletionLibrary.isStepDataExist(context, 'time')) {
        Object.assign(overrides, WorkOrderCompletionLibrary.getStepData(context, 'time'));
        overrides.IsOnCreate = false;
        return ConfirmationUpdateNav(context, overrides);
    }

    return confirmationsCreateUpdateNav(context, overrides, startDate, endDate)
        .catch((error) => {
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryWorkOrders.global').getValue(), error);
        });
}

function openTimeEntryPage(context) {
   if (WorkOrderCompletionLibrary.isStepDataExist(context, 'time')) {
        libCommon.setOnCreateUpdateFlag(context, 'UPDATE');
        context.getPageProxy().setActionBinding(WorkOrderCompletionLibrary.getStepData(context, 'time'));

        return context.executeAction('/SAPAssetManager/Actions/TimeSheets/TimeSheetEntryEditNav.action');
    } else {
        libCommon.setOnCreateUpdateFlag(context, 'CREATE');

        return context.executeAction('/SAPAssetManager/Actions/TimeSheets/TimeSheetEntryCreateForWONav.action')
            .catch((error) => {
                Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryWorkOrders.global').getValue(), error);
            });
    }
}

