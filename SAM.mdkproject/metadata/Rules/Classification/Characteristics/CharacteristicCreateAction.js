import parentEntityType from '../ClassificationParentEntityType';
export default function CharacteristicCreateAction(context) {
    if (parentEntityType(context) === 'Equipments') {
        return context.executeAction('/SAPAssetManager/Actions/Classification/Characteristics/CharacteristicCreateFromEquipment.action');
    } else if (parentEntityType(context) === 'FunctionalLocations') {
        return context.executeAction('/SAPAssetManager/Actions/Classification/Characteristics/CharacteristicCreateFromFLoc.action');
    }
}
