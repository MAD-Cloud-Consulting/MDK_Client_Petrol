
import FetchRequest from '../../Common/Query/FetchRequest';
import CompleteMobileStatusAction from '../../MobileStatus/CompleteMobileStatusAction';
import MobileStatusLibrary from '../../MobileStatus/MobileStatusLibrary';
import libSuper from '../../Supervisor/SupervisorLibrary';
import libCommon from '../../Common/Library/CommonLibrary';
import WorkOrderCompleteFromWOListSwipe from '../../WorkOrders/MobileStatus/WorkOrderCompleteFromWOListSwipe';

/**
 * Operation for executing a 
 */
export default class CompleteOperationMobileStatusAction extends CompleteMobileStatusAction {
    
    name() {
        return 'CompleteMobileStatusAction_Operation';
    }

    getDefaultArgs() {
        let defaultArgs = super.getDefaultArgs();
        defaultArgs.doCheckWorkOrderComplete = true;
        return defaultArgs;
    }

    setActionQueue(actionQueue) {

        if (this.args.isOperationStatusChangeable) { //Set the mobile status to Complete only if operation level assignment
            actionQueue.unshift(this.setMobileStatusComplete);
        }

        // Add a check to see if the parent Work Order should be completed
        if (this.args.doCheckWorkOrderComplete) {
            actionQueue.push(this.executeCheckWorkOrderCompleted);
        } 
        super.setActionQueue(actionQueue);
    }

    entitySet() {
        return 'MyWorkOrderOperations';
    }

    identifier() {
        return `OperationNo='${this.args.OperationId}',OrderId='${this.args.WorkOrderId}'`;
    }

    didSetFinalConfirmationParams(context) {
        super.didSetFinalConfirmationParams(context);
        context.getClientData().FinalConfirmationOrderID = this.args.WorkOrderId;
        context.getClientData().FinalConfirmationOperation = this.args.OperationId;
        // Make sure this is found but blank
        context.getClientData().FinalConfirmationSubOperation = '';
        context.getClientData().FinalConfirmation = 'X';

        context.binding.FinalConfirmationOrderID = this.args.WorkOrderId;
        context.binding.FinalConfirmationOperation = this.args.OperationId;
        // Make sure this is found but blank
        context.binding.FinalConfirmationSubOperation = '';
        context.binding.FinalConfirmation = 'X';
        return true;
    }

    requestSetWorkOrderComplete(context) {
        let promises = [];
        return context.executeAction('/SAPAssetManager/Actions/MobileStatus/MobileStatusOperationCompleteConfirmation.action').then((doSetComplete) => {
            if (doSetComplete.data === true) {
                libCommon.setStateVariable(context, 'FinalConfirmationIsCompletingWorkOrder', true);
                if (context.currentPage.isModal()) { // We have to close this page to show Signature Control Modal
                    promises.push(context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action'));
                    context.evaluateTargetPathForAPI('#Page:-Previous').getClientData().currentObject = this.getWorkOrderDetails(context); 
                } else {
                    context.getClientData().currentObject = this.getWorkOrderDetails(context); 
                }
                return Promise.all(promises).then(() => {
                    return WorkOrderCompleteFromWOListSwipe(context, this.getWorkOrderDetails(context));
                });
            }
            return Promise.resolve(true);
        });
    }
    getWorkOrderDetails(context) {
        if (context.binding.WorkOrderHeader) {
            return context.binding.WorkOrderHeader;
        } else if (context.binding.WOHeader) {
            return context.binding.WOHeader;
        } else {
            return context.binding.WorkOrderOperation.WOHeader;
        }
    }
    executeCheckWorkOrderCompleted(context, instance) {

        if (!MobileStatusLibrary.isHeaderStatusChangeable(context)) {
            // Cannot change the Work Order, exit early
            return Promise.resolve(true);
        }
        let args = instance.args;

        return MobileStatusLibrary.isMobileStatusComplete(context, 'MyWorkOrderHeaders', args.WorkOrderId).then(status => {
            if (status) { //already complete so exit
                return Promise.resolve(true);
            } else {
                // Count the number of Operations that have a mobile status 
                return MobileStatusLibrary.getStatusForOperations(context, args.WorkOrderId).then(query => {
                    let fetchRequest = new FetchRequest('MyWorkOrderOperations', query);
            
                    return fetchRequest.execute(context).then(results => {
                        // Second clause was added because we were seeing something funky. DB didn't seem to be updating before the above query
                        if (results.length === 0 || (results.length === 1 && results.getItem(0).OperationNo === args.OperationId)) {
                                // There are no Operations of this Work Order.
                                // Ask user if they would like to complete the Work Order
                            return libSuper.checkReviewRequired(context, context.binding).then(review => { //Do not auto-complete work order if it requires a review
                                if (!review) {
                                    return instance.requestSetWorkOrderComplete(context, instance);
                                }
                                return Promise.resolve(true);
                            });
                        }
                        return Promise.resolve(true);
                    });
                });
            }
        }); 
        
    }
}
