import libCom from '../Library/CommonLibrary';
import ODataDate from './ODataDate';

/**
 * Return a date offset by the difference between backend and local time
 * @param {Context} context - calling context
 * @param {*} date - (optional) Representation of the Date - default is current date
 * @param {*} time - (optional) Representation of the time
 */
export default function OffsetODataDate(context, date, time) {
    return new ODataDate(date, time, offset(context, date));
}

/**
 * Retrieve the offset between backend and local time
 * It will return the offset based on provided date or the current date. 
 *      
 * @param {*} context 
 * @param {*} date - (optional) Representation of the Date - default is current date
 * @returns {number} - It will return the offset
 */
function offset(context, date) {
    let providedDate;
    if (date) {
        providedDate = new Date(date);
    } else {
        providedDate = new Date();
    }
    let backendOffset = -1 * libCom.getBackendOffsetFromSystemProperty(context);
    let timezoneOffset = (providedDate.getTimezoneOffset()) / 60;
    return backendOffset - timezoneOffset;
}
