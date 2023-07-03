import { WorkOrderLibrary as libWO } from '../../WorkOrders/WorkOrderLibrary';
import MobileStatusLibrary from '../../MobileStatus/MobileStatusLibrary';
import {OperationLibrary as libOperations} from '../../WorkOrders/Operations/WorkOrderOperationLibrary';
import libComm from '../../Common/Library/CommonLibrary';

/**
* Getting count of Service Orders or Operations in COMPLETED status during the certain day
* @param {IClientAPI} context
*/
export default function ServiceOrdersFinishedCount(context) {
    const defaultDate = libWO.getActualDate(context);
    const completed = libComm.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
           
    if (MobileStatusLibrary.isHeaderStatusChangeable(context)) {
        return libWO.statusOrdersCount(context, completed, defaultDate, 'ScheduledStartDate');
    } else if (MobileStatusLibrary.isOperationStatusChangeable(context)) {
        return libOperations.statusOperationsCount(context, completed, defaultDate, 'SchedEarliestStartDate');
    } else {
        return '0';
    }
}
