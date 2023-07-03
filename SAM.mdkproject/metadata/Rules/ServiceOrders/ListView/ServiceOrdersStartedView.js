import libCom from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';
import { WorkOrderLibrary as libWO } from '../../WorkOrders/WorkOrderLibrary';
import MobileStatusLibrary from '../../MobileStatus/MobileStatusLibrary';
import WorkOrdersFSMQueryOption from '../../WorkOrders/ListView/WorkOrdersFSMQueryOption';
import WorkOrderOperationsFSMQueryOption from '../../WorkOrders/Operations/WorkOrderOperationsFSMQueryOption';
import SetPredefinedOperationsListFilters from './SetPredefinedOperationsListFilters';
import SetPredefinedOrdersListFilters from './SetPredefinedOrdersListFilters';

/**
* Switch to WorkOrdersListViewNav or OperationListViewNav with initial filter values
* @param {IClientAPI} context
*/
export default function ServiceOrdersStartedView(context) {
    let actionBinding = {
        isInitialFilterNeeded: true,
    };
    context.getPageProxy().setActionBinding(actionBinding);
    const defaultDate = libWO.getActualDate(context);

    if (MobileStatusLibrary.isHeaderStatusChangeable(context)) {
        return WorkOrdersFSMQueryOption(context).then(types => {
            return libWO.dateOrdersFilter(context, defaultDate, 'ScheduledStartDate').then(dateFilter => {
                let filter = `$filter=(OrderMobileStatus_Nav/MobileStatus eq 'STARTED' or OrderMobileStatus_Nav/MobileStatus eq 'HOLD') and ${dateFilter}`;
            
                if (!libVal.evalIsEmpty(types)) {
                    filter += ' and ' + types;
                }

                libCom.setStateVariable(context, 'WORKORDER_FILTER', filter);
                return context.executeAction('/SAPAssetManager/Actions/WorkOrders/WorkOrdersListViewNav.action').then(() => {
                    SetPredefinedOrdersListFilters(context, ['STARTED', 'HOLD'], defaultDate);
                });  
            });
        });
    } else {
        return WorkOrderOperationsFSMQueryOption(context).then(types => {
            return libWO.dateOperationsFilter(context, defaultDate, 'SchedEarliestStartDate').then(dateFilter => {
                let filter = `$filter=(OperationMobileStatus_Nav/MobileStatus eq 'STARTED' or OperationMobileStatus_Nav/MobileStatus eq 'HOLD') and ${dateFilter}`;
            
                if (!libVal.evalIsEmpty(types)) {
                    filter += ' and ' + types;
                }
                
                libCom.setStateVariable(context, 'OPERATIONS_FILTER', {entity: 'MyWorkOrderOperations', query: filter, localizeTextX: 'operations_x', localizeTextXX: 'operations_x_x'});
                return context.executeAction('/SAPAssetManager/Actions/WorkOrders/Operations/WorkOrderOperationsListViewNav.action').then(() => {
                    SetPredefinedOperationsListFilters(context, ['STARTED', 'HOLD'], defaultDate);
                });
            });
            
        });
    }
}
