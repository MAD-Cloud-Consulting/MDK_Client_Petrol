import {WorkOrderControlsLibrary as LibWoControls} from '../WorkOrderLibrary';

export default function WorkOrderCreateUpdatePriorityValue(pageProxy) {
    return LibWoControls.getPriority(pageProxy);
}
