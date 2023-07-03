export default function NotificationCreateUpdateHierarchyListPickerOnLoaded(control) {
    let name = control.getName();
    let context = control.getPageProxy();

    return setDefaultListPickerValue(context, name);
}

function setDefaultListPickerValue(context, name) {
    let formCellContainer = context.getControl('FormCellContainer');
    var extension;
    var value;

    if (name === 'FuncLocHierarchyExtensionControl') {
        value = formCellContainer.getControl('FuncLocHierarchyExtensionControl').getValue();
        if (!value) {
            value = context.binding.InspectionPoint_Nav.FuncLoc_Nav.FuncLocIdIntern;
        }
        if (value) {
            extension = formCellContainer.getControl('FuncLocHierarchyExtensionControl')._control._extension;
        }
    } else {
        value = formCellContainer.getControl('EquipHierarchyExtensionControl').getValue();
        if (!value) {
            value = context.binding.InspectionPoint_Nav.Equip_Nav.EquipId;
        }
        if (value) {
            extension = formCellContainer.getControl('EquipHierarchyExtensionControl')._control._extension;
        }
    }
    if (extension) {
        extension.setData(value);
    }
}
