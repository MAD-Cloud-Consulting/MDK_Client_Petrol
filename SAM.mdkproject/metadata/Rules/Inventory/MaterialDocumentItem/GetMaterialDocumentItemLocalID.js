import GenerateLocalID from '../../Common/GenerateLocalID';
import libCom from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';

export default function GetMaterialDocumentItemLocalID(context) {
    let queryOptions = '';
    let localMatDocId;

    if (libCom.getStateVariable(context, 'ReceiveAllItemId')) {
        return libCom.getStateVariable(context, 'ReceiveAllItemId'); //Changeset for receive all cannot use the normal lookup, because the prior item rows are not actually saved to DB yet, resulting in the same key being returned each time
    }

    if (!libVal.evalIsEmpty(context.binding) && libCom.getPageName(context) !== 'VehicleIssueOrReceiptCreatePage') {
        localMatDocId = context.binding.TempHeader_Key;
    } else if (!libVal.evalIsEmpty(context.getActionBinding())) {
        localMatDocId = context.getActionBinding().TempHeader_Key;
    } else {
        localMatDocId = context.getClientData().TempHeader_Key;
    }
    
    if (localMatDocId) {
        queryOptions = `$filter=MaterialDocNumber eq '${localMatDocId}'`;
    }

    return GenerateLocalID(context, 'MaterialDocItems', 'MatDocItem', '0000', queryOptions, '').then(LocalId => {
        if (!libVal.evalIsEmpty(context.binding) && libCom.getPageName(context) !== 'VehicleIssueOrReceiptCreatePage') {
            context.binding.TempItem_Key = LocalId; //Save line key to use when updating links on a CreateRelatedEntity mat doc item
        } else if (!libVal.evalIsEmpty(context.getActionBinding())) {
            context.getActionBinding().TempItem_Key = LocalId;
        } else {
            context.getClientData().TempItem_Key = LocalId;
        }
        return LocalId;
    });
}
