export default function SuperiorEquip(clientAPI) {
    let formCellContainer = clientAPI.getControl('FormCellContainer');
    var value = formCellContainer.getControl('EquipHierarchyExtensionControl').getValue();

   return value ? decodeURIComponent(value) : '';
}
