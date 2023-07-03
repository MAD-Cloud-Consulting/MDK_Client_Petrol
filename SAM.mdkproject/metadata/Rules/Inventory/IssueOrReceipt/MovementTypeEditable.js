import libCom from '../../Common/Library/CommonLibrary';

export default function MovementTypeEditable(context) {
    let editable = true;
    let movementType = libCom.getStateVariable(context, 'CurrentDocsItemsMovementType');
    if (movementType) {
        editable = false;
    }
    return editable;
}
