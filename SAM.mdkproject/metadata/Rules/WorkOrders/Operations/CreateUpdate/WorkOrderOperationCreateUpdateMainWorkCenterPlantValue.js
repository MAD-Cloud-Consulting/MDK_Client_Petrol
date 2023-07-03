import {OperationControlLibrary as libOperationControl} from '../WorkOrderOperationLibrary';

export default function WorkOrderOperationCreateUpdateMainWorkCenterPlantValue(pageProxy) {
    return libOperationControl.getWorkCenterPlant(pageProxy);
}
