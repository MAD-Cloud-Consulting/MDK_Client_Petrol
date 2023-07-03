import ConfirmationCreateUpdateAction from './ConfirmationCreateUpdateAction';
import OnSuccess from './OnSuccess';
import libCom from '../../../Common/Library/CommonLibrary';
import CascadingAction from '../../../Common/Action/CascadingAction';
import IsCompleteAction from '../../../WorkOrders/Complete/IsCompleteAction';
import WorkOrderCompletionLibrary from '../../../WorkOrders/Complete/WorkOrderCompletionLibrary';
import CompleteOperationMobileStatusAction from '../../../Operations/MobileStatus/CompleteOperationMobileStatusAction';

export default function CreateUpdateConfirmation(context) {

    let confirmation = context.getBindingObject();
    let pageProxy = context.getPageProxy();
    let isFinalConfirmation = libCom.getControlProxy(context,'IsFinalConfirmation').getValue();
    let previousClientData = context.evaluateTargetPath('#Page:-Previous/#ClientData');
    let mobileStatusAction = previousClientData.mobileStatusAction;
    ///Get the override from client data if avalible. If it's empty use the binding instead (this happens when executing from context menu).
    let confirmationArgs = previousClientData.confirmationArgs ? previousClientData.confirmationArgs:confirmation;
    let isOnCreate = confirmation.IsOnCreate;
    let args = {
        isOnCreate: isOnCreate,
        isFinalConfirmation: isFinalConfirmation,
        WorkOrderId: libCom.getListPickerValue(libCom.getControlProxy(context,'WorkOrderLstPkr').getValue()),
        OperationId: libCom.getListPickerValue(libCom.getControlProxy(context,'OperationPkr').getValue()),
        doCheckOperationComplete: confirmation.doCheckOperationComplete,
        doCheckSubOperationComplete: confirmation.doCheckSubOperationComplete,
    };

    confirmation.OrderID = libCom.getListPickerValue(libCom.getControlProxy(context,'WorkOrderLstPkr').getValue());
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderHeaders', [], `$expand=OrderMobileStatus_Nav&$filter=OrderId eq '${confirmation.OrderID}'&$top=1`).then(result => {
        let order = undefined;
        if (result && result.length > 0) {
            order = result.getItem(0);
        }
        //Update binding so create/update action has access to this screen data
        confirmation.WorkOrderHeader = order;
        confirmation.SubOperation = libCom.getListPickerValue(libCom.getControlProxy(context,'SubOperationPkr').getValue());
        confirmation.VarianceReason = libCom.getListPickerValue(libCom.getControlProxy(context,'VarianceReasonPkr').getValue());
        confirmation.AccountingIndicator = libCom.getListPickerValue(libCom.getControlProxy(context,'AcctIndicatorPkr').getValue());
        confirmation.ActivityType = libCom.getListPickerValue(libCom.getControlProxy(context,'ActivityTypePkr').getValue());
        confirmation.Operation = libCom.getListPickerValue(libCom.getControlProxy(context,'OperationPkr').getValue());
        confirmation.OrderType = order.OrderType;

        let operationObjectPromise = Promise.resolve();
        if (libCom.getWorkOrderAssnTypeLevel(context) === 'Operation') {
            operationObjectPromise = context.read('/SAPAssetManager/Services/AssetManager.service', `MyWorkOrderOperations(OrderId='${confirmation.OrderID}',OperationNo='${confirmation.Operation}')`, [], '$expand=WOHeader');
        }

        return operationObjectPromise.then(results => {
            if (results && results.length > 0) {
                confirmation.OperationObject = results.getItem(0);
            }

            pageProxy._context.binding = confirmation;
    
            if (confirmation.SubOperation.length > 0) {
                args.SubOperationId = confirmation.SubOperation;
            }
    
            if (confirmationArgs !== undefined) {
                // Inject all of the confirmation args
                for (const [key, value] of Object.entries(confirmationArgs)) {
                    if (args[key] === undefined) {
                        args[key] = value;
                    }
                }
            }
    
            let action = new ConfirmationCreateUpdateAction(args);
            let actionOpMobStatus = new CompleteOperationMobileStatusAction(args);
            if (mobileStatusAction !== undefined && mobileStatusAction instanceof CascadingAction) {
                mobileStatusAction.args.didCreateFinalConfirmation = isFinalConfirmation;
                action.pushLinkedAction(mobileStatusAction);
            }
            return action.execute(context).then(() => {
                if (IsCompleteAction(context)) {
                    return WorkOrderCompletionLibrary.getInstance().openMainPage(context);
                } else {
                    if (isOnCreate) {
                        return action.dismissCurrentModalPage(context).then(() => {
                            return OnSuccess(context, isOnCreate).then(() => {
                                return CheckObjectCompletion(context, action, actionOpMobStatus);
                            });
                        });
                    } else {
                        return OnSuccess(context, isOnCreate).then(() => {
                            return CheckObjectCompletion(context, action, actionOpMobStatus);
                        });
                    }
                }
            });
        });
    });
}

function CheckObjectCompletion(context, action, actionOpMobStatus) {
    return action.executeSubOperationComplete(context, action).then(() => {
        let completeOperationAction = Promise.resolve();
        if (actionOpMobStatus.args.doCheckOperationComplete !== false) {
            completeOperationAction = action.executeOperationComplete(context, action);
        }
        return completeOperationAction.then(() => {
            if (actionOpMobStatus.args.doCheckWorkOrderComplete !== false) {
                return actionOpMobStatus.executeCheckWorkOrderCompleted(context, actionOpMobStatus);
            }
           return Promise.resolve();
        });
    });
}
