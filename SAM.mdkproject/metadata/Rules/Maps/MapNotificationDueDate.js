import OffsetODataDate from '../Common/Date/OffsetODataDate';
import Logger from '../Log/Logger';

export default function MapNotificationDueDate(context) {
    try {
        let reqStartDate = context.binding.RequiredStartDate;
        let reqEndDate = context.binding.RequiredEndDate;
        let result = '';
        let isStartValid = (reqStartDate != null);
        let isEndValid = (reqEndDate != null);

        if (!isStartValid && !isEndValid) {
            return context.localizeText('no_due_date');
        }

        // If there is a valid start, add it to the result string
        if (isStartValid) {
            result += context.localizeText('start');
            result += ' ';
            let odataDate = OffsetODataDate(context, reqStartDate);
            let startDate = context.formatDate(odataDate.date());
            result += startDate;

            if (isEndValid) {
                // There is a start and an end, separate the two with a comma
                result += ', ';
            }
        }
        // If there is a valid end, add it to the result string
        if (isEndValid) {
            result += context.localizeText('end');
            result += ' ';
            let odataDate = OffsetODataDate(context, reqEndDate);
            let endDate = context.formatDate(odataDate.date());
            result += endDate;
        }

        return result;
    } catch (e) {
        /**Implementing our Logger class*/
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryMaps.global').getValue(), e);
        return context.localizeText('no_due_date');
    }
}
