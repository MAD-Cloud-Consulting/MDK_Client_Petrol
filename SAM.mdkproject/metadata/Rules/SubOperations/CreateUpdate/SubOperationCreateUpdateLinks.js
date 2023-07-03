import {SubOperationLibrary as libSupOperation} from '../SubOperationLibrary';

export default function SubOperationCreateUpdateLinks(pageProxy) {
    return libSupOperation.getCreateUpdateLinks(pageProxy);
}
