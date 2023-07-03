import {WorkOrderControlsLibrary as LibWoControls} from '../WorkOrderLibrary';

export default function WorkOrderCreateUpdateTypeValue(pageProxy) {
    return LibWoControls.getOrderType(pageProxy);
}
