import libCom from '../../Common/Library/CommonLibrary';
import CompleteWorkOrderMobileStatusAction from '../MobileStatus/CompleteWorkOrderMobileStatusAction';
import WorkOrderMobileStatusLibrary from '../MobileStatus/WorkOrderMobileStatusLibrary';
import PDFGenerateDuringCompletion from '../../PDF/PDFGenerateDuringCompletion';
import WorkOrderCompletionLibrary from './WorkOrderCompletionLibrary';
import libAutoSync from '../../ApplicationEvents/AutoSync/AutoSyncLibrary';
import OperationMobileStatusLibrary from '../../Operations/MobileStatus/OperationMobileStatusLibrary';
import libMobile from '../../MobileStatus/MobileStatusLibrary';
import ODataDate from '../../Common/Date/ODataDate';
import libClock from '../../ClockInClockOut/ClockInClockOutLibrary';
import generateGUID from '../../Common/guid';
import CompleteOperationMobileStatusAction from '../../Operations/MobileStatus/CompleteOperationMobileStatusAction';
import CompleteSubOperationMobileStatusAction from '../../SubOperations/MobileStatus/CompleteSubOperationMobileStatusAction';
import SubOperationMobileStatusLibrary from '../../SubOperations/MobileStatus/SubOperationMobileStatusLibrary';
import isConfirmationEnabledOperation from '../../Operations/IsTimeStepVisible';
import RedrawCompletePage from './RedrawCompletePage';

export default function FinalizeCompletePage(context) {
    return isConfirmationEnabledOperation(context).then((isConfirmationEnabled) => { 
    if (!WorkOrderCompletionLibrary.validateSteps(context)) {
        WorkOrderCompletionLibrary.setValidationMessages(context);
        RedrawCompletePage(context);
        return Promise.reject();
    } else {
        WorkOrderCompletionLibrary.resetValidationMessages(context);
        RedrawCompletePage(context);
    }
 
    let completeAction = Promise.resolve();
    let mobileStatus = '';
    let binding = WorkOrderCompletionLibrary.getInstance().getBinding(context);

    if (WorkOrderCompletionLibrary.getInstance().isOperationFlow()) {
        let actions = beforeOperationComplete(context, isConfirmationEnabled);
        completeAction = getOperationCompleteAction(context);
        mobileStatus = getOperationMobileStatus(context);
        let pageContext = context;
        return Promise.all(actions).then(()=> {
            return completeAction.setMobileStatusComplete(pageContext, completeAction, binding)
                .then(() => {
                    return OperationMobileStatusLibrary.didSetOperationComplete(pageContext, mobileStatus).then(() => {
                        return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
                            return PDFGenerateDuringCompletion(context, binding).then(() => {
                                WorkOrderCompletionLibrary.getInstance().setCompleteFlag(pageContext, false);
                                WorkOrderCompletionLibrary.getInstance().deleteBinding(pageContext);
                                return completeAction.executeCheckWorkOrderCompleted(pageContext, completeAction).then(() => {
                                    return libAutoSync.autoSyncOnStatusChange(context);
                                });
                            });
                        });
                    });
                })
                .catch(() => {
                    return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/OperationMobileStatusFailureMessage.action');
                });
        });
    } else if (WorkOrderCompletionLibrary.getInstance().isSubOperationFlow()) {
        let actions = beforeSubOperationComplete(context, isConfirmationEnabled);
        completeAction = getSubOperationCompleteAction(context);
        mobileStatus = getSubOperationMobileStatus(context);
        let pageContext = context;
        return Promise.all(actions).then(()=> { 
            return completeAction.setMobileStatusComplete(pageContext, completeAction, binding)
                .then(() => {
                    return pageContext.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
                        return SubOperationMobileStatusLibrary.didSetSubOperationCompleteWrapper(pageContext, mobileStatus).then(() => {
                            WorkOrderCompletionLibrary.getInstance().setCompleteFlag(pageContext, false);
                            WorkOrderCompletionLibrary.getInstance().deleteBinding(pageContext);
                          
                            libCom.removeBindingObject(context);
                            libCom.removeStateVariable(context, 'contextMenuSwipePage');
                           
                            return completeAction.executeCheckOperationCompleted(pageContext, completeAction).then(() => {
                                return libAutoSync.autoSyncOnStatusChange(context);
                            });
                        });
                    });
                })
                .catch(() => {
                    return pageContext.executeAction('/SAPAssetManager/Actions/WorkOrders/SubOperations/SubOperationMobileStatusFailureMessage.action');
                });
        });
    } else {
        completeAction = getWOCompleteAction(context);
        mobileStatus = getWOMobileStatus(context);
        let pageContext = context;
        return completeAction.execute(pageContext)
            .then(() => {
                return WorkOrderMobileStatusLibrary.didSetWorkOrderComplete(pageContext, mobileStatus).then(() => {
                    return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
                        return PDFGenerateDuringCompletion(context, binding).then(() => {
                            return libAutoSync.autoSyncOnStatusChange(context);
                        });
                    }).finally(() => {
                        WorkOrderCompletionLibrary.getInstance().setCompleteFlag(pageContext, false);
                        WorkOrderCompletionLibrary.getInstance().deleteBinding(pageContext);
                        
                        libCom.removeBindingObject(pageContext);
                        libCom.removeStateVariable(pageContext, 'contextMenuSwipePage');
                    });
                });
            })
            .catch(() => {
                return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/WorkOrderMobileStatusFailureMessage.action');
            });
    }
});
}

function getWOMobileStatus(context) {
    let binding = WorkOrderCompletionLibrary.getInstance().getBinding(context);
    let mobileStatus = binding.OrderMobileStatus_Nav;

    if (mobileStatus && !mobileStatus.ObjectType) {
        mobileStatus.ObjectType = libCom.getAppParam(context, 'OBJECTTYPE', 'WorkOrder'); 
    }

    return mobileStatus;
}

function getOperationMobileStatus(context) {
    let binding = WorkOrderCompletionLibrary.getInstance().getBinding(context);
    let mobileStatus = binding.OperationMobileStatus_Nav;

    if (mobileStatus && !mobileStatus.ObjectType) {
        mobileStatus.ObjectType = libCom.getAppParam(context, 'OBJECTTYPE', 'Operation'); 
    }

    return mobileStatus;
}

function getSubOperationMobileStatus(context) {
    let binding = WorkOrderCompletionLibrary.getInstance().getBinding(context);
    let mobileStatus = binding.SubOpMobileStatus_Nav;

    if (mobileStatus && !mobileStatus.ObjectType) {
        mobileStatus.ObjectType = libCom.getAppParam(context, 'OBJECTTYPE', 'SubOperation'); 
    }

    return mobileStatus;
}

function getWOCompleteAction(context) {
    let binding = WorkOrderCompletionLibrary.getInstance().getBinding(context);
    let actionArgs = {
        WorkOrderId: binding.OrderId,
    };
    let action = new CompleteWorkOrderMobileStatusAction(actionArgs);
    
    context.getClientData().confirmationArgs = {
        doCheckWorkOrderComplete: false,
    };
    context.getClientData().mobileStatusAction = action;

    return action;
}

function getOperationCompleteAction(context) {
    let binding = WorkOrderCompletionLibrary.getInstance().getBinding(context);
    let actionArgs = {
        OperationId: binding.OperationNo,
        WorkOrderId: binding.OrderId,
        isOperationStatusChangeable: libMobile.isOperationStatusChangeable(context),
        isHeaderStatusChangeable: libMobile.isHeaderStatusChangeable(context),
        didCreateFinalConfirmation: libCom.getStateVariable(context, 'IsFinalConfirmation', libCom.getPageName(context)),
    };

    let action = new CompleteOperationMobileStatusAction(actionArgs);
    context.getClientData().confirmationArgs = {
        doCheckOperationComplete: false,
    };
    context.getClientData().mobileStatusAction = action;

    return action;     
}

function beforeOperationComplete(context, isConfirmationEnabled) {
    let binding = WorkOrderCompletionLibrary.getInstance().getBinding(context);
    let actions = [];

    if (!WorkOrderCompletionLibrary.getStepValue(context, 'time') && isConfirmationEnabled) {
        actions.push(OperationMobileStatusLibrary.createBlankConfirmation(context));
    }
    
    if (libMobile.isOperationStatusChangeable(context)) { //Handle clock out create for operation
        var odataDate = new ODataDate();
        actions.push(context.executeAction({'Name': '/SAPAssetManager/Actions/ClockInClockOut/WorkOrderClockInOut.action', 'Properties': {
            'Properties': {
                'RecordId': generateGUID(),
                'UserGUID': libCom.getUserGuid(context),
                'OperationNo': binding.OperationNo,
                'OrderId': binding.OrderId,
                'PreferenceGroup': libClock.isCICOEnabled(context) ? 'CLOCK_OUT' : 'END_TIME',
                'PreferenceName': binding.OrderId,
                'PreferenceValue': odataDate.toDBDateTimeString(context),
                'UserId': libCom.getSapUserName(context),
            },
            'CreateLinks': [{
                'Property': 'WOOperation_Nav',
                'Target':
                {
                    'EntitySet': 'MyWorkOrderOperations',
                    'ReadLink': "MyWorkOrderOperations(OrderId='" + binding.OrderId + "',OperationNo='" + binding.OperationNo + "')",
                },
            }],
        }}));
    }

    return actions;
}

function beforeSubOperationComplete(context, isConfirmationEnabled) {
    let binding = WorkOrderCompletionLibrary.getInstance().getBinding(context);
    let actions = [];

    if (!WorkOrderCompletionLibrary.getStepValue(context, 'time') && isConfirmationEnabled) {
        actions.push(OperationMobileStatusLibrary.createBlankConfirmation(context));
    }
    
    if (libMobile.isSubOperationStatusChangeable(context)) {
        libClock.setClockOutSubOperationODataValues(context);
        actions.push(context.executeAction(
            { 'Name': '/SAPAssetManager/Actions/ClockInClockOut/WorkOrderClockInOut.action', 'Properties': {
                'Properties': {
                    'RecordId': generateGUID(),
                    'UserGUID': libCom.getUserGuid(context),
                    'OperationNo': binding.OperationNo,
                    'SubOperationNo': binding.SubOperationNo,
                    'OrderId': binding.OrderId,
                    'PreferenceGroup': 'END_TIME',
                    'PreferenceName': binding.OrderId,
                    'PreferenceValue': new ODataDate().toDBDateTimeString(context),
                    'UserId': libCom.getSapUserName(context),
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

    return actions;
}

function getSubOperationCompleteAction(context) {
    let binding = WorkOrderCompletionLibrary.getInstance().getBinding(context);
    let actionArgs = {
        SubOperationId: binding.SubOperationNo,
        OperationId: binding.OperationNo,
        WorkOrderId: binding.OrderId,
        isSubOperationStatusChangeable: libMobile.isSubOperationStatusChangeable(context),
        isOperationStatusChangeable: libMobile.isOperationStatusChangeable(context),
        isHeaderStatusChangeable: libMobile.isHeaderStatusChangeable(context),
        didCreateFinalConfirmation: libCom.getStateVariable(context, 'IsFinalConfirmation', libCom.getPageName(context)),
    };

    let action = new CompleteSubOperationMobileStatusAction(actionArgs);
    context.getClientData().confirmationArgs = {
        doCheckSubOperationComplete: false,
        doCheckOperationComplete: false,
    };

   return action;
}
