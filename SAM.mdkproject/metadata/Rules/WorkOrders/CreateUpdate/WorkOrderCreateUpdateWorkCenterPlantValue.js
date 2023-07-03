import {WorkOrderControlsLibrary as LibWoControls} from '../WorkOrderLibrary';

export default function WorkOrderCreateUpdateWorkCenterPlantValue(pageProxy) {
    return LibWoControls.getWorkCenterPlant(pageProxy);
}
