import {WorkOrderEventLibrary as LibWoEvent} from '../WorkOrderLibrary';

export default function WorkOrderCreateUpdateVisibility(control) {
    return LibWoEvent.createUpdateVisibility(control);
}
