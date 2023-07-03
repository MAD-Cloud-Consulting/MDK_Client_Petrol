import libVal from '../../Common/Library/ValidationLibrary';
export default function WorkOrderCreateUpdateHierarchyListPickerOnLoaded(control) {
    if (libVal.evalIsEmpty(control.getPageProxy().binding)) {
        control.getPageProxy()._context.binding = control.binding;
    }

    let name = control.getName();
    let context = control.getPageProxy();
    let formCellContainer = context.getControl('FormCellContainer');
    var extension;
    var value;

    const controlFromFormCell = formCellContainer.getControl(name);

    //Flag setEmptyValue is used for reset value 
    //If setEmptyValue true, reset flag and keep control value empty
    if (controlFromFormCell.getClientData().setEmptyValue) {
        controlFromFormCell.getClientData().setEmptyValue = false;

        return;
    }

    if (name === 'FuncLocHierarchyExtensionControl') {
        value = controlFromFormCell.getValue();
        if (!value) {
            value = context.binding.HeaderFunctionLocation;
        }
        if (value) {
            extension = controlFromFormCell._control._extension;
        }
    } else {
        value = controlFromFormCell.getValue();
        if (!value) {
            value = context.binding.HeaderEquipment;
        }
        if (value) {
            extension = controlFromFormCell._control._extension;
        }
    }
    if (extension) {
        extension.setData(value);
    }
}
