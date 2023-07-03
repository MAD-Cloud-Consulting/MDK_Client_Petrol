import libCom from '../../Common/Library/CommonLibrary';
import { WorkOrderLibrary as libWO } from '../../WorkOrders/WorkOrderLibrary';
import MobileStatusLibrary from '../../MobileStatus/MobileStatusLibrary';
import {OperationLibrary as libOperations} from '../../WorkOrders/Operations/WorkOrderOperationLibrary';
import SetPredefinedOperationsListFilters from './SetPredefinedOperationsListFilters';
import SetPredefinedOrdersListFilters from './SetPredefinedOrdersListFilters';

/**
* Switch to WorkOrdersListViewNav or OperationListViewNav with initial filter values
* @param {IClientAPI} context
*/
export default function ServiceOrdersReceivedView(context) {
    let actionBinding = {
        isInitialFilterNeeded: true,
    };
    context.getPageProxy().setActionBinding(actionBinding);
    const defaultDate = libWO.getActualDate(context);

    if (MobileStatusLibrary.isHeaderStatusChangeable(context)) {
        const filter = libWO.statusOrdersFilter(context, 'RECEIVED', defaultDate, 'ScheduledStartDate');
        libCom.setStateVariable(context, 'WORKORDER_FILTER', filter);
        return context.executeAction('/SAPAssetManager/Actions/WorkOrders/WorkOrdersListViewNav.action').then(() => {
            SetPredefinedOrdersListFilters(context, 'RECEIVED', defaultDate);
        });  
    } else {
        return libOperations.statusOperationFilter(context, 'RECEIVED', defaultDate, 'SchedEarliestStartDate').then(filter => {
            libCom.setStateVariable(context, 'OPERATIONS_FILTER', {entity: 'MyWorkOrderOperations', query: filter, localizeTextX: 'operations_x', localizeTextXX: 'operations_x_x'});
            return context.executeAction('/SAPAssetManager/Actions/WorkOrders/Operations/WorkOrderOperationsListViewNav.action').then(() => {
                SetPredefinedOperationsListFilters(context, 'RECEIVED', defaultDate);
            });
        });
    }
}
