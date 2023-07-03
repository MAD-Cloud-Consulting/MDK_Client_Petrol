import ValidationLibrary from '../../../Common/Library/ValidationLibrary';

export default function EquipmentHierarchyListPickerOnLoaded(control) {
    let name = control.getName();
    let context = control.getPageProxy();
    let formCellContainer = context.getControl('FormCellContainer');
    var extension;
    var value;

    if (name === 'FuncLocHierarchyExtensionControl') {
        value = formCellContainer.getControl('FuncLocHierarchyExtensionControl').getValue();
        if (!value && !ValidationLibrary.evalIsEmpty(context.binding)) {
            value = context.binding.FuncLocId;
        }
        if (value) {
            extension = formCellContainer.getControl('FuncLocHierarchyExtensionControl')._control._extension;
        }
    } else {
        value = formCellContainer.getControl('EquipHierarchyExtensionControl').getValue();
        if (!value && !ValidationLibrary.evalIsEmpty(context.binding)) {
            value = context.binding.SuperiorEquip;
        }
        if (value) {
            extension = formCellContainer.getControl('EquipHierarchyExtensionControl')._control._extension;
        }
    }
    if (extension) {
        extension.setData(value);
    }
}
