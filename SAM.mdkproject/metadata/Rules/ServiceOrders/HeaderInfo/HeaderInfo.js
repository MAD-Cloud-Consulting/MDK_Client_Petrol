import { WorkOrderLibrary as libWO } from '../../WorkOrders/WorkOrderLibrary';
import libCom from '../../Common/Library/CommonLibrary';

/**
* Providing header with actual date info
* @param {IClientAPI} context
*/

export default function HeaderInfo(context) {
    const defaultDate = libWO.getActualDate(context);
    return libCom.relativeDayOfWeek(defaultDate, context) + ', ' + context.formatDate(defaultDate);
}
