import { WorkOrderLibrary as libWO } from '../../WorkOrders/WorkOrderLibrary';
import dateLabel from '../../DateTime/DateLabel';
/**
* Providing actual header to the map component
* @param {IClientAPI} context
*/
export default function HeaderMapInfo(context) {
    const defaultDate = libWO.getActualDate(context);
    const actualValue = dateLabel(defaultDate);
    let actualDate = `${defaultDate.toUTCString().split(' ')[2]} ${defaultDate.getDate()}`;
    switch (actualValue) {
        case 'today':
            actualDate = context.localizeText('day_today');
            break;
        case 'yesterday':
            actualDate = context.localizeText('day_yesterday');
            break;
        default:
            break;
    }
    return context.localizeText('route_day', [actualDate]);
}
