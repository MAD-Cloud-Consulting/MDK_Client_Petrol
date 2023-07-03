import UnconfirmOperationMobileStatusAction from '../../Operations/MobileStatus/UnconfirmOperationMobileStatusAction';

export default class UnconfirmSubOperationMobileStatusAction extends UnconfirmOperationMobileStatusAction {

    didSetConfirmationParams(context) {
        context.getClientData().FinalConfirmationOrderID = this.args.WorkOrderId;
        context.getClientData().FinalConfirmationOperation = this.args.OperationId;
        context.getClientData().FinalConfirmationSubOperation = this.args.SubOperationId;
        context.getClientData().FinalConfirmation = '';

        context.binding.FinalConfirmationOrderID = this.args.WorkOrderId;
        context.binding.FinalConfirmationOperation = this.args.OperationId;
        context.binding.FinalConfirmationSubOperation = this.args.SubOperationId;
        context.binding.FinalConfirmation = '';
        return true;
    }

    entitySet() {
        return 'MyWorkOrderSubOperations';
    }

    identifier() {
        return `OperationNo='${this.args.OperationId}',OrderId='${this.args.WorkOrderId}',SubOperationNo='${this.args.SubOperationId}'`;
    }
}
