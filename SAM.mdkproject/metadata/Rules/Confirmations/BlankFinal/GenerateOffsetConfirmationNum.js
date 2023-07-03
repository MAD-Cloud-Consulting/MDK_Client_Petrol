import GenerateLocalConfirmatioNum from '../CreateUpdate/OnCommit/GenerateLocalConfirmationNum';
import libEval from '../../Common/Library/ValidationLibrary';

/**
 * Since multiple Confirmations may be created as part of one Change Set operation,
 * we need to offset the Generated local ID. Incremeted every time it is accessed
 * @param {*} context 
 */
export default function GenerateOffsetConfirmationNum(context) {

    let finalConfOffset = 1;
    if (!libEval.evalIsEmpty(context.getClientData())) {
        context.getClientData().FinalConfirmationOffset = finalConfOffset + 1;
    }
    
    return GenerateLocalConfirmatioNum(context, finalConfOffset);
}
