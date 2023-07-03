import { WorkOrderLibrary as libWO } from '../WorkOrders/WorkOrderLibrary';

export default function FSMOverviewRouteMapQueryOptions(context) {
    const defaultDate = libWO.getActualDate(context);
    return libWO.dateOrdersFilter(context, defaultDate, 'ScheduledStartDate')
        .then(dateFilter => {
            return dateFilter ? ('$top=1&$filter=' + dateFilter) : '$top=1';
        }).catch(()=>{
            return '$top=1';
        });
}
