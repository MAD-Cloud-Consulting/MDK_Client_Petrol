import {SubOperationControlLibrary as libSupOpControl} from '../SubOperationLibrary';

export default function SubOperationCreateUpdateMainWorkCenterValue(pageProxy) {
    return libSupOpControl.getMainWorkCenter(pageProxy);
}
