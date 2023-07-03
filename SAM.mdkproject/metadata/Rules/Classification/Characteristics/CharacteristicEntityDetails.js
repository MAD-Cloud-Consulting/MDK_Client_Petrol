
import parentEntityType from '../ClassificationParentEntityType';
/**
 * Get the Entity details to later make a dynamic query.
 * Currently it's passing entity name, id and type but
 * can be extended later to add more values.
 * @param {*} context 
 */
export default function CharacteristicEntityDetails(context) {
    let entityDetails = [];
    var entityType = context.binding['@odata.type'];
    var idType;
    if (entityType === '#sap_mobile.MyEquipClassCharValue') {
        entityType = 'MyEquipClassCharValues';
        context.binding.id = context.binding.EquipId;
        idType = 'EquipId';
    } else if (entityType === '#sap_mobile.MyFuncLocClassCharValue') {
        entityType = 'MyFuncLocClassCharValues';
        context.binding.id = context.binding.FuncLocIdIntern;
        idType = 'FuncLocIdIntern';
    } else if (entityType === '#sap_mobile.ClassCharacteristic') {
        context.binding.CharId = context.binding.Characteristic.CharId;
        if (parentEntityType(context) === 'Equipments') {
            entityType = 'MyEquipClassCharValues';
            context.binding.id = context.evaluateTargetPathForAPI('#Page:-Previous').binding.EquipId;
            idType = 'EquipId';
        } else {
            entityType = 'MyFuncLocClassCharValues';
            context.binding.id = context.evaluateTargetPathForAPI('#Page:-Previous').binding.FuncLocIdIntern;
            idType = 'FuncLocIdIntern';
        }
    } else {
        entityType = '';
        context.binding.id ='';
        idType = '';
    }
    entityDetails.push({
        'EntityName': entityType,
        'ID': context.binding.id,
        'IDType': idType,
    });
    return entityDetails;

}
