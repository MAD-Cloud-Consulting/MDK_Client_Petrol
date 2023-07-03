import libEval from '../../Common/Library/ValidationLibrary';
/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function FinalConfirmationOrderID(context) {
    let binding = context.getBindingObject();
    if (!libEval.evalIsEmpty(context.getClientData().currentObject) && !libEval.evalIsEmpty(context.getClientData().currentObject.FinalConfirmationOrderID)) {
        return context.getClientData().currentObject.FinalConfirmationOrderID;
    } else if (!libEval.evalIsEmpty(context.getClientData().FinalConfirmationOrderID)) {
        return context.getClientData().FinalConfirmationOrderID;
    }
    return binding.FinalConfirmationOrderID;
}
