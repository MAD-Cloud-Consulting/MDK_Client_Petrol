import {WorkOrderLibrary} from '../WorkOrderLibrary';

export default function WorkOrderCreateUpdateFollowOnValue(context) {
    const formCellContainer = context.getPageProxy().getControl('FormCellContainer');
    const flocControl = formCellContainer.getControl('FuncLocHierarchyExtensionControl');
    const flocExtension = flocControl._control._extension;
    const equipControl = formCellContainer.getControl('EquipHierarchyExtensionControl');
    const equipExtension = equipControl._control._extension;


    if (context.getValue()) {
        WorkOrderLibrary.setFollowOnFlag(context, true);
        
        //Restore initial Equipment and FLOC from original WO
        flocExtension.reload();
        equipExtension.reload();
    } else {
        WorkOrderLibrary.setFollowOnFlag(context, false);

        //Reset Equipment and FLOC
        //setEmptyValue needed for ignoring default values which set in extension OnLoaded event
        if (flocControl.getValue()) {
            flocExtension.reload().then(() => {
                flocControl.getClientData().setEmptyValue = true;
            });
        }

        if (equipControl.getValue()) {
            equipExtension.reload().then(() => {
                equipControl.getClientData().setEmptyValue = true;
            });
        }
    }
}
