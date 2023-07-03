import libCom from '../../../Common/Library/CommonLibrary';
import parentEntityType from '../../ClassificationParentEntityType';

export default function CharacteristicDeleteReadLink(context) {
    let isMultiListPicker = libCom.getStateVariable(context,'MultiListPicker');
    let charValCounter = libCom.getStateVariable(context,'CharValCountIndex'); 
    let isLocal = libCom.isCurrentReadLinkLocal(context.binding['@odata.readLink']);

    let entitySet = '';
    if (parentEntityType(context) === 'Equipments') {
        entitySet = 'MyEquipClassCharValues';
    } else if (parentEntityType(context) === 'FunctionalLocations') {
        entitySet = 'MyFuncLocClassCharValues';
    }
    if (isMultiListPicker && !isLocal) {
        return entitySet + '(CharId='+ '\'' + context.binding.CharId + '\',' + 'CharValCounter=\'' + charValCounter +'\','+ 'ClassType=\'' + context.evaluateTargetPathForAPI('#Page:-Previous').binding.ClassType + '\',' + 'InternCounter=\'0000\',ObjClassFlag=' + '\'' + context.evaluateTargetPathForAPI('#Page:-Previous').binding.ObjClassFlag + '\''+ ',ObjectKey='+ '\'' +context.evaluateTargetPathForAPI('#Page:-Previous').binding.ObjectKey + '\''+ ')';
    } else if (isMultiListPicker && isLocal) { // Checking if the Characteristic is multiple list picker and if there are characteristics created locally and we want to delete it.
        return libCom.getStateVariable(context,'CurrentLocalReadLink'); 
    } else {
        return context.binding['@odata.readLink'];
    }
}
