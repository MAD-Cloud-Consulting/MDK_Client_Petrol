import {WorkOrderControlsLibrary as LibWoControls} from '../WorkOrderLibrary';

export default function WorkOrderCreateUpdateBusinessAreaValue(pageProxy) {
    return LibWoControls.getBusinessArea(pageProxy);
}
