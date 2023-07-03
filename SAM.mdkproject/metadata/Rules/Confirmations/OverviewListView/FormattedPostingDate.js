import ODataDate from '../../Common/Date/ODataDate';
import libCom from '../../Common/Library/CommonLibrary';
import { WorkOrderLibrary as libWO } from '../../WorkOrders/WorkOrderLibrary';

export default function FormattedPostingDate(context) {
    let postingDate = context.getBindingObject().PostingDate || libWO.getActualDate(context);
    let date = new ODataDate(postingDate).date();
    return libCom.relativeDayOfWeek(date, context) + ', ' + context.formatDate(date);
}
