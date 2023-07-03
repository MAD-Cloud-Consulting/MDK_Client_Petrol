import {WorkOrderEventLibrary as LibWoEvent} from '../WorkOrderLibrary';
export default function WorkOrderCreateUpdateOnChange(control) {
    if (control.getName() === 'FuncLocHierarchyExtensionControl' || control.getName() === 'EquipHierarchyExtensionControl') {
        LibWoEvent.createUpdateOnChange(control, true); // Set the isExtension optional flag to true if the rule is being called from extension control
    } else {
        if (control.getName() === 'TypeLstPkr') {
            control.getPageProxy().getClientData().LOADED = true;
        }
        LibWoEvent.createUpdateOnChange(control);
    }
}
