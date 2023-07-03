import { WorkOrderLibrary as libWO } from '../../WorkOrders/WorkOrderLibrary';
import MobileStatusLibrary from '../../MobileStatus/MobileStatusLibrary';
import {OperationLibrary as libOperations} from '../../WorkOrders/Operations/WorkOrderOperationLibrary';

/**
* Getting count of Service Orders or Operations in RECEIVED status during a certain day
* @param {IClientAPI} context
*/
export default function ServiceOrdersReceivedCount(context) {
    const defaultDate = libWO.getActualDate(context);

    if (MobileStatusLibrary.isOperationStatusChangeable(context)) {
        return libOperations.statusOperationsCount(context, 'RECEIVED', defaultDate, 'SchedEarliestStartDate');
    } else {
        return '0';
    }
}
