export default function SuperiorFloc(context) {
    let formCellContainer = context.getControl('FormCellContainer');
    var value = formCellContainer.getControl('SuperiorFuncLocHierarchyExtensionControl').getValue();

   return value ? decodeURIComponent(value) : '';
}
