import {SubOperationControlLibrary as libSupOpControl} from '../SubOperationLibrary';

export default function SubOperationCreateUpdateFuncLocValue(pageProxy) {
    return libSupOpControl.getFunctionalLocationValue(pageProxy);
}
