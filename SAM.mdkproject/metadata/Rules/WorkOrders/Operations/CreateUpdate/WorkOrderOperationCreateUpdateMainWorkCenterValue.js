import {OperationControlLibrary as libOperationControl} from '../WorkOrderOperationLibrary';

export default function WorkOrderOperationCreateUpdateMainWorkCenterValue(pageProxy) {
    return libOperationControl.getMainWorkCenter(pageProxy);
}
