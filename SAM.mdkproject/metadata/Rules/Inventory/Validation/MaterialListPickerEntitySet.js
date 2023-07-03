import common from '../../Common/Library/CommonLibrary';

export default function MaterialListPickerEntitySet(context) {
    let objectType = common.getStateVariable(context, 'IMObjectType');
    let move = common.getStateVariable(context, 'IMMovementType');
    if (objectType === 'ADHOC' && move === 'R') {
        return 'MaterialPlants';
    }
    return 'MaterialSLocs';
}
