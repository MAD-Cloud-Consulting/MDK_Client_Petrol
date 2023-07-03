import {OperationEventLibrary as libOperationEvent} from '../WorkOrderOperationLibrary';

export default function WorkOrderOperationCreateUpdateControlsQueryOptions(controlProxy) {
    return libOperationEvent.createUpdateControlsQueryOptions(controlProxy);
}
