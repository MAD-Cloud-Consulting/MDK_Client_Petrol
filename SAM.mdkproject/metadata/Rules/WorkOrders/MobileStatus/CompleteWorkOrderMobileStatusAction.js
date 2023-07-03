import CompleteMobileStatusAction from '../../MobileStatus/CompleteMobileStatusAction';
import libCommon from '../../Common/Library/CommonLibrary';

export default class CompleteWorkOrderMobileStatusAction extends CompleteMobileStatusAction {

    name() {
        return 'CompleteMobileStatusAction_WorkOrder';
    }

    entitySet() {
        return 'MyWorkOrderHeaders';
    }

    identifier() {
        // Needs to be in single quotes for fetch request
        return `'${this.args.WorkOrderId}'`;
    }

    setActionQueue(actionQueue) {
        // Put this action at the front of the queue
        actionQueue.unshift(this.setMobileStatusComplete);
        super.setActionQueue(actionQueue);
    }

    /**
     * You need an operation to create a confirmation. Thus, this should return false.
     */
    didSetFinalConfirmationParams() {
        return false;
    }

    setMobileStatusComplete(context, instance) {
        let binding = libCommon.getBindingObject(context);
        if (!libCommon.isDefined(binding)) {
            binding = context.getClientData().currentObject;
        }
        
        if (binding.WorkOrderHeader || binding.WOHeader) {
            context._context.binding = binding.WorkOrderHeader ? binding.WorkOrderHeader : binding.WOHeader;
        }
        return super.setMobileStatusComplete(context, instance);
    }

}
