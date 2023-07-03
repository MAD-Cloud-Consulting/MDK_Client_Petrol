import { SubOperationControlLibrary as libSubOpControl } from './SubOperationLibrary';

export default function SubOperationPersonNum(pageProxy) {
    return libSubOpControl.getPersonNum(pageProxy);
}
