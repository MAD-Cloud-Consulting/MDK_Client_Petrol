export default function EquipmentQueryOptions(context) {
    
    if (context.binding['@odata.type'] === '#sap_mobile.InspectionCharacteristic') {
        return `$filter=EquipId eq '${context.binding.EAMChecklist_Nav.Equipment}'&$orderby=EquipId`;
    }
    
    let pageProxy;
    try {
        pageProxy = context.getPageProxy();
    } catch (err) {
        let controlProxy = context.binding.clientAPI;
        pageProxy = controlProxy.getPageProxy();
    }
    let floc = pageProxy.getControl('FormCellContainer').getControl('FuncLocHierarchyExtensionControl').getValue();

    if (floc) {
        return `$orderby=EquipId&$filter=FuncLocIdIntern eq '${floc}'`;
    } else {
        return '$orderby=EquipId&$filter=true';
    }
}
