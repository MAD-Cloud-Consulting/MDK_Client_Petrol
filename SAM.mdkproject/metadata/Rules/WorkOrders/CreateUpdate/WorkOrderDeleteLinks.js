import {WorkOrderLibrary as libWo} from '../WorkOrderLibrary';

export default function WorkOrderDeleteLinks(pageProxy) {
    return libWo.getDeleteLinks(pageProxy);
}
