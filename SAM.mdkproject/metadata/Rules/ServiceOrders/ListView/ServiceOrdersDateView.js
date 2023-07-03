import libCom from '../../Common/Library/CommonLibrary';
import { WorkOrderLibrary as libWO } from '../../WorkOrders/WorkOrderLibrary';
import getWorkOrdersFSMQueryOption from '../../WorkOrders/ListView/WorkOrdersFSMQueryOption';
import SetPredefinedOrdersListFilters from './SetPredefinedOrdersListFilters';
/**
* Switch to WorkOrdersListViewNav with initial filter values
* @param {IClientAPI} context
*/
export default function ServiceOrdersDateView(context) {
    let actionBinding = {
        isInitialFilterNeeded: true,
    };
    context.getPageProxy().setActionBinding(actionBinding);
    const defaultDate = libWO.getActualDate(context);
    return libWO.dateOrdersFilter(context, defaultDate, 'ScheduledStartDate').then(dateFilter => {
        return getWorkOrdersFSMQueryOption(context).then(types => {
            const filter = `$expand=OrderMobileStatus_Nav,WOPriority&$filter=(OrderMobileStatus_Nav/MobileStatus eq 'RECEIVED'
            or OrderMobileStatus_Nav/MobileStatus eq 'COMPLETED' or OrderMobileStatus_Nav/MobileStatus eq 'STARTED'
            or OrderMobileStatus_Nav/MobileStatus eq 'HOLD') and ${dateFilter} and ${types}`;
            libCom.setStateVariable(context, 'WORKORDER_FILTER', filter);
            return context.executeAction('/SAPAssetManager/Actions/WorkOrders/WorkOrdersListViewNav.action').then(() => {
                SetPredefinedOrdersListFilters(context, '', defaultDate);
            });
        });
    });
}
