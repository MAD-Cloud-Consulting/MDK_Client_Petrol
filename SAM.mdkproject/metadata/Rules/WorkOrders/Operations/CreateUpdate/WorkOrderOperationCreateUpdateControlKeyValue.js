import {OperationControlLibrary as libOperationControl} from '../WorkOrderOperationLibrary';

export default function WorkOrderOperationCreateUpdateControlKeyValue(pageProxy) {
    return libOperationControl.getControlKey(pageProxy);
}
