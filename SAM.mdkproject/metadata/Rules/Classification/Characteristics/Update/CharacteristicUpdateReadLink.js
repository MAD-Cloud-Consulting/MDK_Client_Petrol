import libCom from '../../../Common/Library/CommonLibrary';
import charValCounter from '../../Characteristics/CharValCounter';
import parentEntityType from '../../ClassificationParentEntityType';

export default function CharacteristicUpdateReadLink(context) {
    let isMultiListPicker = libCom.getStateVariable(context,'MultiListPicker');
    let entitySet = '';
    if (parentEntityType(context) === 'Equipments') {
        entitySet = 'MyEquipClassCharValues';
    } else if (parentEntityType(context) === 'FunctionalLocations') {
        entitySet = 'MyFuncLocClassCharValues';
    }

    if (isMultiListPicker) {
        return entitySet + '(CharId='+ '\'' + context.binding.CharId + '\',' + 'CharValCounter=\'' + charValCounter(context) +'\','+ 'ClassType=\'' + context.evaluateTargetPathForAPI('#Page:-Previous').binding.ClassType + '\',' + 'InternCounter=\'0000\',ObjClassFlag=' + '\'' + context.evaluateTargetPathForAPI('#Page:-Previous').binding.ObjClassFlag + '\''+ ',ObjectKey='+ '\'' +context.evaluateTargetPathForAPI('#Page:-Previous').binding.ObjectKey + '\''+ ')';
    } else {
        return context.binding['@odata.readLink'];
    }
}
