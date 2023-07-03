import { WorkOrderLibrary as libWO } from '../../WorkOrders/WorkOrderLibrary';
import MobileStatusLibrary from '../../MobileStatus/MobileStatusLibrary';
import libComm from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';
import WorkOrderOperationsFSMQueryOption from '../../WorkOrders/Operations/WorkOrderOperationsFSMQueryOption';
import WorkOrdersFSMQueryOption from '../../WorkOrders/ListView/WorkOrdersFSMQueryOption';

/**
* Getting count of Service Orders or Operations in ACCEPTED status  during a certain day
* @param {IClientAPI} context
*/
export default function ServiceOrdersAcceptedCount(context) {
    const defaultDate = libWO.getActualDate(context);
    if (MobileStatusLibrary.isHeaderStatusChangeable(context)) {
        return libWO.dateOrdersFilter(context, defaultDate, 'ScheduledStartDate').then(dateFilter => {
            return WorkOrdersFSMQueryOption(context).then(types => {
                const RECEIVED = libComm.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReceivedParameterName.global').getValue());
                const TRAVEL = libComm.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/TravelParameterName.global').getValue());
                const ONSITE = libComm.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/OnsiteParameterName.global').getValue());
                   
                let queryOption = `$filter=(OrderMobileStatus_Nav/MobileStatus eq '${RECEIVED}' or OrderMobileStatus_Nav/MobileStatus eq '${TRAVEL}' or OrderMobileStatus_Nav/MobileStatus eq '${ONSITE}') and ${dateFilter}`;
                
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
                const ACCEPTED = libComm.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/AcceptedParameterName.global').getValue());
                const TRAVEL = libComm.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/TravelParameterName.global').getValue());
                const ONSITE = libComm.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/OnsiteParameterName.global').getValue());
                let queryOption = `$filter=(OperationMobileStatus_Nav/MobileStatus eq '${ACCEPTED}' or OperationMobileStatus_Nav/MobileStatus eq '${TRAVEL}' or OperationMobileStatus_Nav/MobileStatus eq '${ONSITE}') and ${dateFilter}`;
                
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
