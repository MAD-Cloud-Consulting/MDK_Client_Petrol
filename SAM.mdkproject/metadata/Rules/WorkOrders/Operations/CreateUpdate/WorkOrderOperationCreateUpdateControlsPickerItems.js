import {OperationEventLibrary as libOperationEvent} from '../WorkOrderOperationLibrary';

export default function WorkOrderOperationCreateUpdateControlsPickerItems(controlProxy) {
    return libOperationEvent.createUpdateControlsPickerItems(controlProxy);
}
