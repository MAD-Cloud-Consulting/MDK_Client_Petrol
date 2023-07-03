import { WorkOrderLibrary as WoLib} from './WorkOrderLibrary';

export default function WorkOrderHighPriorityOrdersCount(pageClientAPI) {
    return WoLib.highPriorityOrdersCount(pageClientAPI).then((count) => {
        return count;
    });   
}
