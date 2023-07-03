import { OperationControlLibrary as libOperationControl } from './WorkOrderOperationLibrary';

export default function WorkOrderOperationPersonNum(pageProxy) {
    return libOperationControl.getPersonNum(pageProxy);
}
