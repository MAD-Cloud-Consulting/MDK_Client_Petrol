import {OperationControlLibrary as libOperationControl} from '../WorkOrderOperationLibrary';

export default function WorkOrderOperationCreateUpdateFuncLocValue(pageProxy) {
    return libOperationControl.getFunctionalLocationValue(pageProxy);
}
