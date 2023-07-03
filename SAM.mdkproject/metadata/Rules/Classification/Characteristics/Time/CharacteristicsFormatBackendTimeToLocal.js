import OffsetODataDate from '../../../Common/Date/OffsetODataDate';

/**
   * Format the time coming as "100300" to first converting to appropriate format
   * and then changing it from backend to local format.
   * 
   * @param {} context
   * 
   * @returns {Date} returns the date time object with correct time format
   * 
   */
export default function CharacteristicsFormatBackendTimeToLocal(context, time) {
    var timeString = time.toString();
    timeString = `${timeString.slice(0,2)}:${timeString.slice(2,4)}:${timeString.slice(4)}`;
    let odataDate = OffsetODataDate(context, undefined, timeString);
    return odataDate.date();
}
