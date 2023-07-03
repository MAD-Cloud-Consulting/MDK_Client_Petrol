import libCom from '../../Common/Library/CommonLibrary';

export default function GetItemText(context) {
    let type;
    let objectType = libCom.getStateVariable(context, 'IMObjectType');
    let moveType = libCom.getStateVariable(context, 'IMMovementType');
    
    if (context.binding) {
        type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
        if (type === 'MaterialDocItem' &&!(objectType === 'REV' && moveType !== 'EDIT')) {
            return context.binding.ItemText;
        }
    }
    return ''; //If not editing an existing local receipt item, then default to empty
}
