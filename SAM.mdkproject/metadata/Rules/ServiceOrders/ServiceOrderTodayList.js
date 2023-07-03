import { WorkOrderLibrary as libWO } from '../WorkOrders/WorkOrderLibrary';
import getWorkOrdersFSMQueryOption from '../WorkOrders/ListView/WorkOrdersFSMQueryOption';

/**
* Returning actual query options depending on current date
* @param {IClientAPI} context
*/
export default function ServiceOrdersDateFilter(context) {
    const defaultDate = libWO.getActualDate(context);
    return libWO.dateOrdersFilter(context, defaultDate, 'ScheduledStartDate').then(dateFilter => {
        return getWorkOrdersFSMQueryOption(context).then(types => {
            return `$expand=OrderMobileStatus_Nav,WOPriority&$filter=(OrderMobileStatus_Nav/MobileStatus eq 'RECEIVED'
            or OrderMobileStatus_Nav/MobileStatus eq 'COMPLETED' or OrderMobileStatus_Nav/MobileStatus eq 'STARTED'
            or OrderMobileStatus_Nav/MobileStatus eq 'HOLD') and ${dateFilter} and ${types}&$top=2`;
        });
    });
}
