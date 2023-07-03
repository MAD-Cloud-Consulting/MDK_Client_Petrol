import libCom from '../../Common/Library/CommonLibrary';
import { WorkOrderLibrary as libWO } from '../../WorkOrders/WorkOrderLibrary';
import MobileStatusLibrary from '../../MobileStatus/MobileStatusLibrary';
import WorkOrderOperationsFSMQueryOption from '../../WorkOrders/Operations/WorkOrderOperationsFSMQueryOption';
import libVal from '../../Common/Library/ValidationLibrary';
import WorkOrdersFSMQueryOption from '../../WorkOrders/ListView/WorkOrdersFSMQueryOption';
import SetPredefinedOperationsListFilters from './SetPredefinedOperationsListFilters';
import SetPredefinedOrdersListFilters from './SetPredefinedOrdersListFilters';

/**
* Switch to WorkOrdersListViewNav or OperationListViewNav with initial filter values
* @param {IClientAPI} context
*/
export default function ServiceOrdersAcceptedView(context) {
    let actionBinding = {
        isInitialFilterNeeded: true,
    };
    context.getPageProxy().setActionBinding(actionBinding);
    const defaultDate = libWO.getActualDate(context);

    if (MobileStatusLibrary.isHeaderStatusChangeable(context)) {
        return libWO.dateOrdersFilter(context, defaultDate, 'ScheduledStartDate').then(dateFilter => {
            return WorkOrdersFSMQueryOption(context).then(types => {
                const RECEIVED = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReceivedParameterName.global').getValue());
                const TRAVEL = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/TravelParameterName.global').getValue());
                const ONSITE = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/OnsiteParameterName.global').getValue());
                   
                let queryOption = `$filter=(OrderMobileStatus_Nav/MobileStatus eq '${RECEIVED}' or OrderMobileStatus_Nav/MobileStatus eq '${TRAVEL}' or OrderMobileStatus_Nav/MobileStatus eq '${ONSITE}') and ${dateFilter}`;
                
                if (!libVal.evalIsEmpty(types)) {
                    queryOption += ' and ' + types;
                }
    
                libCom.setStateVariable(context, 'WORKORDER_FILTER', queryOption);
                return context.executeAction('/SAPAssetManager/Actions/WorkOrders/WorkOrdersListViewNav.action').then(() => {
                    SetPredefinedOrdersListFilters(context, [RECEIVED, TRAVEL, ONSITE], defaultDate);
                });  
            });
        });
    } else {
        return WorkOrderOperationsFSMQueryOption(context).then(types => {
            return libWO.dateOperationsFilter(context, defaultDate, 'SchedEarliestStartDate').then(dateFilter => {
                const ACCEPTED = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/AcceptedParameterName.global').getValue());
                const TRAVEL = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/TravelParameterName.global').getValue());
                const ONSITE = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/OnsiteParameterName.global').getValue());
            
                let filter = `$filter=(OperationMobileStatus_Nav/MobileStatus eq '${ACCEPTED}'
                    or OperationMobileStatus_Nav/MobileStatus eq '${TRAVEL}'
                    or OperationMobileStatus_Nav/MobileStatus eq '${ONSITE}')
                    and ${dateFilter}`;

                if (!libVal.evalIsEmpty(types)) {
                    filter += ' and ' + types;
                }
                
                libCom.setStateVariable(context, 'OPERATIONS_FILTER', {entity: 'MyWorkOrderOperations', query: filter, localizeTextX: 'operations_x', localizeTextXX: 'operations_x_x'});
                return context.executeAction('/SAPAssetManager/Actions/WorkOrders/Operations/WorkOrderOperationsListViewNav.action').then(() => {
                    SetPredefinedOperationsListFilters(context, [ACCEPTED, TRAVEL, ONSITE], defaultDate);
                });
            });
        });
    }
}
