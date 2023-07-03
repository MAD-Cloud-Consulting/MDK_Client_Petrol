import libCrew from '../CrewLibrary';
import ConvertDoubleToHourString from '../../Confirmations/ConvertDoubleToHourString';

export default function CrewTimeSheetsPreviousDayHours(context, format=true) {
    let date = new Date();
    date.setDate(date.getDate() - 1);
    return libCrew.getTotalHoursWithDateForCurrentCrew(context,date).then((hours) => {
        if (format) {
            return ConvertDoubleToHourString(hours);
        } else {
            return hours;
        }
    });
}
