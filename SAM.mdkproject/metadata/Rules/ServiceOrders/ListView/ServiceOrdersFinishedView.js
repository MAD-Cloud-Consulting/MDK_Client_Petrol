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
export default function ServiceOrdersFinishedView(context) {
    let actionBinding = {
        isInitialFilterNeeded: true,
    };
    context.getPageProxy().setActionBinding(actionBinding);
    const defaultDate = libWO.getActualDate(context);
    const completed = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
       
    if (MobileStatusLibrary.isHeaderStatusChangeable(context)) {
        return libWO.statusOrdersFilter(context, completed, defaultDate, 'ScheduledStartDate').then(filter => {
            libCom.setStateVariable(context, 'WORKORDER_FILTER', filter);
            return context.executeAction('/SAPAssetManager/Actions/WorkOrders/WorkOrdersListViewNav.action').then(() => {
                SetPredefinedOrdersListFilters(context, completed, defaultDate);
            });  
        });
    } else {
        return libOperations.statusOperationFilter(context, completed, defaultDate, 'SchedEarliestStartDate').then(filter => {
            libCom.setStateVariable(context, 'OPERATIONS_FILTER', {entity: 'MyWorkOrderOperations', query: filter, localizeTextX: 'operations_x', localizeTextXX: 'operations_x_x'});
            return context.executeAction('/SAPAssetManager/Actions/WorkOrders/Operations/WorkOrderOperationsListViewNav.action').then(() => {
                SetPredefinedOperationsListFilters(context, completed, defaultDate);
            });
        });
    }
}
