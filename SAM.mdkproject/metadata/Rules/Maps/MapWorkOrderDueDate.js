import OffsetODataDate from '../Common/Date/OffsetODataDate';

import Logger from '../Log/Logger';

export default function MapWorkOrderDueDate(context) {
    try {
        let dueDate = context.binding.DueDate;
        if (dueDate == null) {
            return context.localizeText('no_due_date');
        } else {
            let odataDate = OffsetODataDate(context, dueDate);
            let due = context.formatDate(odataDate.date());
            return context.localizeText('due_on') + ' ' + due;
        }
    } catch (e) {
        /**Implementing our Logger class*/
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryMaps.global').getValue(), e);
        return context.localizeText('no_due_date');
    }
}
