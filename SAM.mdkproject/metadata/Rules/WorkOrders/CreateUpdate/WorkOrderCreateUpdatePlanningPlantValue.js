import {WorkOrderControlsLibrary as LibWoControls} from '../WorkOrderLibrary';


export default function WorkOrderCreateUpdatePlanningPlantValue(pageProxy) {
    return LibWoControls.getPlanningPlant(pageProxy);
}
