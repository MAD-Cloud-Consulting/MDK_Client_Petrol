import {WorkOrderControlsLibrary as LibWoControls} from '../WorkOrderLibrary';

export default function WorkOrderCreateUpdateMainWorkCenterValue(pageProxy) {
    return LibWoControls.getMainWorkCenter(pageProxy);
}
