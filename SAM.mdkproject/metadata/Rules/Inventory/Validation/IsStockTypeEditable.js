import libCom from '../../Common/Library/CommonLibrary';

export default function IsStockTypeEditable(context) {
    let editable = true;
    let movementType = libCom.getStateVariable(context, 'IMMovementType');
    let objectType = libCom.getStateVariable(context, 'IMObjectType');

    if ((movementType === 'R' || movementType === 'I') && (objectType === 'IB' || objectType === 'OB')) {
        editable = false;
    }
    if (objectType === 'REV') {
        editable = false;
    }

    return editable;
}
