import { WorkOrderLibrary as libWO } from '../../WorkOrders/WorkOrderLibrary';
import getWorkOrdersFSMQueryOption from '../../WorkOrders/ListView/WorkOrdersFSMQueryOption';
/**
* Getting count of all current day Service Orders
* @param {IClientAPI} context
*/
export default function ServiceOrdersDateFilter(context) {
    const defaultDate = libWO.getActualDate(context);
    return libWO.dateOrdersFilter(context, defaultDate, 'ScheduledStartDate').then(dateFilter => {
        return getWorkOrdersFSMQueryOption(context).then(types => {
            let options = `$expand=OrderMobileStatus_Nav,WOPriority&$filter=(OrderMobileStatus_Nav/MobileStatus eq 'RECEIVED'
            or OrderMobileStatus_Nav/MobileStatus eq 'COMPLETED' or OrderMobileStatus_Nav/MobileStatus eq 'STARTED'
            or OrderMobileStatus_Nav/MobileStatus eq 'HOLD') and ${dateFilter} and ${types}`;
            return context.count('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderHeaders', options);
        }); 
    });
}
