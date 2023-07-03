import {OperationLibrary as libOperation} from '../WorkOrderOperationLibrary';

export default function WorkOrderOperationCreateUpdateLinks(pageProxy) {
    return libOperation.getCreateUpdateLinks(pageProxy);
}
