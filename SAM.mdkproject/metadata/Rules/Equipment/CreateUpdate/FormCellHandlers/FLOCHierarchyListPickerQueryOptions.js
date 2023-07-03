import maintenancePlant from '../../../HierarchyControl/MaintenancePlantForEquipment';
export default function FLOCHierarchyListPickerQueryOptions(controlProxy) {
    let result = `$orderby=FuncLocId&$filter=(MaintPlant eq '${maintenancePlant(controlProxy)}')`;
    return Promise.resolve(result);
}
