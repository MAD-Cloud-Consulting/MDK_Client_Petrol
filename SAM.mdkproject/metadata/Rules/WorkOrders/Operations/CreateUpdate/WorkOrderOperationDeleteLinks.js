import {OperationLibrary as libOperation} from '../WorkOrderOperationLibrary';

export default function WorkOrderOperationDeleteLinks(pageProxy) {
    return libOperation.getDeleteLinks(pageProxy);
}
