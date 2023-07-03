import libCrew from '../CrewLibrary';
import ConvertDoubleToHourString from '../../Confirmations/ConvertDoubleToHourString';
export default function CrewTimeSheetsTodaysHours(context, format=true) {
    let date;
    if (context.binding === undefined) { //The binding object doesn't exist on the Overview page hence, looking for the Date property results in an error.
        date = new Date();
        date.setHours(0,0,0,0);
    } else {
        date = context.binding.Date;
    }
    return libCrew.getTotalHoursWithDateForCurrentCrew(context, date).then((hours) => {
        if (format) {
            return ConvertDoubleToHourString(hours);
        } else {
            return hours;
        }
    });
}
