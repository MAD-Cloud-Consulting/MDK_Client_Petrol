import { SubOperationControlLibrary as libSubOpControl } from './SubOperationLibrary';

export default function SubOperationOperationNo(pageProxy) {
    return libSubOpControl.getOperationNo(pageProxy);
}
