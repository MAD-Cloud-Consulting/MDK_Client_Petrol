import {SubOperationControlLibrary as libSupOpControl} from '../SubOperationLibrary';

export default function SubOperationCreateUpdateMainWorkCenterPlantValue(pageProxy) {
    return libSupOpControl.getWorkCenterPlant(pageProxy);
}
