import common from '../../Common/Library/CommonLibrary';
import showMaterialNumberListPicker from '../Validation/ShowMaterialNumberListPicker';

export default function IsPlantEditable(context) {
    let editable = true;
    let movementType = common.getStateVariable(context, 'IMMovementType');
    let objectType = common.getStateVariable(context, 'IMObjectType');

    if (objectType === 'REV') {
        editable = false;
    }
    if ((movementType === 'R' || movementType === 'I') && (objectType === 'IB' || objectType === 'OB')) {
        editable = false;
    }
    if (!showMaterialNumberListPicker(context)) {
        editable = false;
    }
    return editable;
}
