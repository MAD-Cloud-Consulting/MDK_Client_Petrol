import {WorkOrderLibrary as LibWo} from '../WorkOrders/WorkOrderLibrary';

export default function RemindersQueryOptions() {
    return LibWo.getRemindersQueryOptionsFilter();
}
