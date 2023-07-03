import {SubOperationLibrary as libSupOperation} from '../SubOperationLibrary';

export default function SubOperationDeleteLinks(pageProxy) {
    return libSupOperation.getDeleteLinks(pageProxy);
}
