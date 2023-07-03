import libCom from '../../Common/Library/CommonLibrary';
import showMaterialNumberListPicker from './ShowMaterialNumberListPicker';

export default function IsStorageLocationEditable(context) {
    let editable = true;
    let objectType = libCom.getStateVariable(context, 'IMObjectType');

    if (objectType === 'REV') {
        editable = false;
    }
    if (!showMaterialNumberListPicker(context) && (objectType === 'MAT')) {
        editable = false;
    }

    return editable;
}
