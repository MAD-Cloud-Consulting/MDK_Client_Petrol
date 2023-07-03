import {WorkOrderControlsLibrary as LibWoControls} from '../WorkOrderLibrary';

export default function WorkOrderCreateUpdateEquipmentValue(pageProxy) {
    return LibWoControls.getEquipmentValue(pageProxy);
}
