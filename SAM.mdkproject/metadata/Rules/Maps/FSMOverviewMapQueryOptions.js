import FSMMapQueryOptions from './FSMMapQueryOptions';
import { WorkOrderLibrary as libWO } from '../WorkOrders/WorkOrderLibrary';

export default function FSMOverviewMapQueryOptions(context) {  
    const defaultDate = libWO.getActualDate(context);
    return libWO.dateOrdersFilter(context, defaultDate, 'ScheduledStartDate').then(dateFilter => {
        return FSMMapQueryOptions(context, dateFilter);
    });   
}
