import libCom from '../../../Common/Library/CommonLibrary';
import parentEntityType from '../../ClassificationParentEntityType';
/**
 * Delete the Characteristics by setting the appropriate char val counter.
 * The reason to do read again here is that the CharValCounter may not be 
 * always sequential i.e. 001, 002. You might have to two characterisitcs
 * but the counter could be 001 and 004 so we have to do a read to find
 * appropriate counters.
 * @param {*} context 
 */
export default function CharacteristicDelete(context) {
    var idType;
    let entityType = context.binding['@odata.type'];
    if (parentEntityType(context) === 'Equipments') {
        entityType = 'MyEquipClassCharValues';
        context.binding.id = context.binding.EquipId;
        idType = 'EquipId';
    } else if (parentEntityType(context) === 'FunctionalLocations') {
        entityType = 'MyFuncLocClassCharValues';
        context.binding.id = context.binding.FuncLocIdIntern;
        idType = 'FuncLocIdIntern';
    } 
    return context.read('/SAPAssetManager/Services/AssetManager.service', entityType, [], '$filter=(CharId eq \'' + context.binding.CharId + '\' and '+ idType +' eq \'' + context.binding.id + '\')&$orderby=CharId,' + idType).then((results) => {
        for (var i = 0; i < results.length; i++) {
            let obj = results.getItem(i);
            // We set the CharValCountIndex here so that the @CharacteristicDeleteReadLink function can use it to 
            // delete the appropriate Char
            libCom.setStateVariable(context,'CharValCountIndex', obj.CharValCounter);
            let highestCounter = libCom.getStateVariable(context,'HighestCounter');
            if (obj.CharValCounter > highestCounter) {
                libCom.setStateVariable(context,'HighestCounter', obj.CharValCounter);
            }
            // Putting the read link to be later fetched by the CharacteristicDeleteReadLink.js file where we need correct read link
            // to delete a particular char from  the list.
            libCom.setStateVariable(context,'CurrentLocalReadLink', obj['@odata.readLink']);
            return context.executeAction('/SAPAssetManager/Actions/Classification/Characteristics/CharacteristicDelete.action');
        }
        return '';
    });
}
