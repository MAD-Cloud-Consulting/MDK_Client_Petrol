import libFOWCom from './CommonLibrary';
import libCom from '../../../Common/Library/CommonLibrary';
import libVal from '../../../Common/Library/ValidationLibrary';
import OffsetODataDate from '../../../Common/Date/OffsetODataDate';

export default class {

    /**
     * Format the stop count for a route.
     * @param {*} count 
     */
    static formatRouteListStopCount(context, count) {
        count = (count === undefined || count === '') ? 0 : count;
        if (count === 1) {
            return context.localizeText('fow_stop_count_with_number', [count]);
        } else {
            return context.localizeText('fow_stops_count_with_number', [count]);
        }
    }

    /**
     * Format the asset count for a stop.
     * @param {*} count 
     */
    static formatStopListAssetCount(context, count) {
        count = (count === undefined || count === '') ? 0 : count;
        if (count === 1) {
            return context.localizeText('fow_asset_count_with_number', [count]);
        } else {
            return context.localizeText('fow_assets_count_with_number', [count]);
        }
    }

    /**
     * Formats the route due date
     * @param {*} context 
     * @param {*} dueDate 
     */
    static formatRouteDueDate(context, dueDate) {
        if (!libVal.evalIsEmpty(dueDate)) {
            let localDate = OffsetODataDate(context, dueDate).date();
            return libFOWCom.isDateToday(localDate) ? context.localizeText('fow_due_today'): context.formatDate(localDate);
        } else {
            return context.localizeText('no_due_date');
        }
    }

    /**
     * Formats the date to be in format of MM-dd-yyyy
     * @param {*} context 
     * @param {*} date 
     */
    static formatDate(context, date) {
        if (libVal.evalIsEmpty(date)) {
            return '';
        } else {
            let localDateTime = OffsetODataDate(context, date).date();
            return libCom.getFormattedDate(localDateTime, context);
        }
    }

}
