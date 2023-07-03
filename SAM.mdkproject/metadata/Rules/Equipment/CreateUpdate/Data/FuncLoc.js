export default function FuncLoc(clientAPI) {
    let formCellContainer = clientAPI.getControl('FormCellContainer');
    var value = formCellContainer.getControl('FuncLocHierarchyExtensionControl').getValue();

    return value ? decodeURIComponent(value) : '';
}
