import { WorkOrderLibrary as libWO } from '../../WorkOrders/WorkOrderLibrary';
import MobileStatusLibrary from '../../MobileStatus/MobileStatusLibrary';
import libVal from '../../Common/Library/ValidationLibrary';
import WorkOrdersFSMQueryOption from '../../WorkOrders/ListView/WorkOrdersFSMQueryOption';
import WorkOrderOperationsFSMQueryOption from '../../WorkOrders/Operations/WorkOrderOperationsFSMQueryOption';

/**
* Getting count of Service Orders or Operations in STARTED or HOLD status during the certain day
* @param {IClientAPI} context
*/
export default function ServiceOrdersStartedCount(context) {
    const defaultDate = libWO.getActualDate(context);

    if (MobileStatusLibrary.isHeaderStatusChangeable(context)) {
        return libWO.dateOrdersFilter(context, defaultDate, 'ScheduledStartDate').then(dateFilter => {
            return WorkOrdersFSMQueryOption(context).then(types => {
                let queryOption = `$filter=(OrderMobileStatus_Nav/MobileStatus eq 'STARTED' or OrderMobileStatus_Nav/MobileStatus eq 'HOLD') and ${dateFilter}`;
                
                if (!libVal.evalIsEmpty(types)) {
                    queryOption += ' and ' + types;
                }
    
                return context.count(
                    '/SAPAssetManager/Services/AssetManager.service',
                    'MyWorkOrderHeaders',
                    queryOption);
            });
        });
        
    } else if (MobileStatusLibrary.isOperationStatusChangeable(context)) {
        return WorkOrderOperationsFSMQueryOption(context).then(types => {
            return libWO.dateOperationsFilter(context, defaultDate, 'SchedEarliestStartDate').then(dateFilter => {
                let queryOption = `$filter=(OperationMobileStatus_Nav/MobileStatus eq 'STARTED'
                or OperationMobileStatus_Nav/MobileStatus eq 'HOLD')
                and ${dateFilter}`;

                if (!libVal.evalIsEmpty(types)) {
                    queryOption += ' and ' + types;
                }

                return context.count(
                    '/SAPAssetManager/Services/AssetManager.service',
                    'MyWorkOrderOperations',
                    queryOption);
            });
        });
    } else {
        return '0';
    }
}
