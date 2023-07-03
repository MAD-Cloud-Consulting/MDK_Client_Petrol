import {WorkOrderEventLibrary as LibWoEvent} from '../WorkOrderLibrary';

export default function WorkOrderCreateUpdateControlsQueryOptions(controlProxy) {
    return LibWoEvent.createUpdateControlsQueryOptions(controlProxy);
}
