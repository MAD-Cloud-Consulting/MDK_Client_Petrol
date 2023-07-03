import parentEntityType from '../../ClassificationParentEntityType';

export default function CharacteristicsUpdateEntitySet(context) {
    if (parentEntityType(context) === 'Equipments') {
        return 'MyEquipClassCharValues';
    } else if (parentEntityType(context) === 'FunctionalLocations') {
        return 'MyFuncLocClassCharValues';
    }
}
