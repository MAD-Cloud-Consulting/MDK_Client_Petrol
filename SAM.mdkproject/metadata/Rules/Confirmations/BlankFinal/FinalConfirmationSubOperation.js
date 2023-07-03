import libEval from '../../Common/Library/ValidationLibrary';
/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function FinalConfirmationSubOperation(context) {
    let binding = context.getBindingObject();
    if (!libEval.evalIsEmpty(context.getClientData().currentObject) && !libEval.evalIsEmpty(context.getClientData().currentObject.FinalConfirmationSubOperation)) {
        return context.getClientData().currentObject.FinalConfirmationSubOperation;
    } else if (!libEval.evalIsEmpty(context.getClientData().FinalConfirmationSubOperation)) {
        return context.getClientData().FinalConfirmationSubOperation;
    }
    return binding.FinalConfirmationSubOperation;
}
