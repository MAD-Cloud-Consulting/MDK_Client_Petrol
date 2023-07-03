
import MobileStatusAction from '../../MobileStatus/MobileStatusAction';

export default class UnconfirmOperationMobileStatusAction extends MobileStatusAction {

    didSetConfirmationParams(context) {
        context.getClientData().FinalConfirmationOrderID = this.args.WorkOrderId;
        context.getClientData().FinalConfirmationOperation = this.args.OperationId;
        // Make sure this is found but blank
        context.getClientData().FinalConfirmationSubOperation = '';
        context.getClientData().FinalConfirmation = '';

        context.binding.FinalConfirmationOrderID = this.args.WorkOrderId;
        context.binding.FinalConfirmationOperation = this.args.OperationId;
        // Make sure this is found but blank
        context.binding.FinalConfirmationSubOperation = '';
        context.binding.FinalConfirmation = '';

        return true;
    }

    entitySet() {
        return 'MyWorkOrderOperations';
    }

    identifier() {
        return `OperationNo='${this.args.OperationId}',OrderId='${this.args.WorkOrderId}'`;
    }
}
