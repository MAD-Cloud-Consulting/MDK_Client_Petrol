import {SubOperationControlLibrary as libSupOpControl} from '../SubOperationLibrary';

export default function SubOperationCreateUpdateEquipmentValue(pageProxy) {
    return libSupOpControl.getEquipmentValue(pageProxy);
}
