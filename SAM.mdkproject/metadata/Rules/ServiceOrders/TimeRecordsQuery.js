import CommonLibrary from '../Common/Library/CommonLibrary';
import { WorkOrderLibrary as libWO } from '../WorkOrders/WorkOrderLibrary';
/**
* Returning actual query options for time records depending on current date
* @param {IClientAPI} context
*/
export default function TimeRecordsQuery(context) {
    const defaultDate = libWO.getActualDate(context);
    return CommonLibrary.createOverviewRow(context, defaultDate).then(dateFilter => {
        return `${dateFilter}&$orderby=PostingDate desc&$top=2`;
    });
}
