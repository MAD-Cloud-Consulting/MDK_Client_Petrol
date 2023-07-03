import {SubOperationControlLibrary as libSupOpControl} from '../SubOperationLibrary';

export default function SubOperationCreateUpdateControlKeyValue(pageProxy) {
    return libSupOpControl.getControlKey(pageProxy);
}
