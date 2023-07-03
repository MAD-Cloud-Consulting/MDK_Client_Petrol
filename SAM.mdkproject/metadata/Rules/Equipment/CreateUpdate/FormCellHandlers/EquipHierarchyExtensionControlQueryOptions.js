import maintenancePlant from '../../../HierarchyControl/MaintenancePlantForEquipment';
export default function EquipHierarchyExtensionControlQueryOptions(controlProxy) {
    let result = `$orderby=EquipId&$filter=(MaintPlant eq '${maintenancePlant(controlProxy)}')`;
    return Promise.resolve(result);
}
