import libCom from '../../Common/Library/CommonLibrary';
import { WorkOrderLibrary as libWO } from '../../WorkOrders/WorkOrderLibrary';
import SetPredefinedOperationsListFilters from './SetPredefinedOperationsListFilters';
/**
* Switch to WorkOrdersListViewNav with initial filter values
* @param {IClientAPI} context
*/
export default function ServiceOperationsDateView(context) {
    let actionBinding = {
        isInitialFilterNeeded: true,
    };
    context.getPageProxy().setActionBinding(actionBinding);
    const defaultDate = libWO.getActualDate(context);
    return libWO.dateOperationsFilter(context, defaultDate, 'SchedEarliestStartDate').then(dateFilter => {
        const filter = `$filter=${dateFilter}`;
        libCom.setStateVariable(context, 'OPERATIONS_FILTER', {entity: 'MyWorkOrderOperations', query: filter, localizeTextX: 'operations_x', localizeTextXX: 'operations_x_x'});
        return context.executeAction('/SAPAssetManager/Actions/WorkOrders/Operations/WorkOrderOperationsListViewNav.action').then(() => {
            SetPredefinedOperationsListFilters(context, '', defaultDate);
        });
    });
    
}
