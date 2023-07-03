import libEval from '../../Common/Library/ValidationLibrary';
/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function FinalConfirmationOperation(context) {
    let binding = context.getBindingObject();
    if (!libEval.evalIsEmpty(context.getClientData().currentObject) && !libEval.evalIsEmpty(context.getClientData().currentObject.FinalConfirmationOperation)) {
        return context.getClientData().currentObject.FinalConfirmationOperation;
    } else if (!libEval.evalIsEmpty(context.getClientData().FinalConfirmationOperation)) {
        return context.getClientData().FinalConfirmationOperation;
    }
    return binding.FinalConfirmationOperation;
}
