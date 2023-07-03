import libCom from '../../Common/Library/CommonLibrary';

export default function GetAutoSerial(context) {
    let type;
    let movementType = libCom.getStateVariable(context, 'IMMovementType');
    let objectType = libCom.getStateVariable(context, 'IMObjectType');

    if ((movementType === 'R' || movementType === 'I') && (objectType === 'IB' || objectType === 'OB')) {
        return false;
    }

    if (context.binding) {
        type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
        if (type === 'MaterialDocItem') {
            return (context.binding.AutoGenerateSerialNumbers === 'X' ? true: false);
        }
    }
    return false; //If not editing an existing local receipt item, then default to false
}
