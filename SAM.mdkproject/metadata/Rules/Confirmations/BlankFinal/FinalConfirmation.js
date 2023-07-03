import libEval from '../../Common/Library/ValidationLibrary';

/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function FinalConfirmation(context) {
    let binding = context.getBindingObject();
    if (!libEval.evalIsEmpty(context.getClientData().currentObject) && !libEval.evalIsEmpty(context.getClientData().currentObject.FinalConfirmation)) {
        return context.getClientData().currentObject.FinalConfirmation;
    } else if (!libEval.evalIsEmpty(context.getClientData().FinalConfirmation)) {
        return context.getClientData().FinalConfirmation;
    }
    return binding.FinalConfirmation;
}
