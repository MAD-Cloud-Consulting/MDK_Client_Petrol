import {WorkOrderLibrary as libWo} from '../WorkOrderLibrary';

export default function WorkOrderCreateUpdateLinks(pageProxy) {
    return libWo.getCreateUpdateLinks(pageProxy);
}
