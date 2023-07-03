import libCrew from '../CrewLibrary';
import ConvertDoubleToHourString from '../../Confirmations/ConvertDoubleToHourString';

export default function CrewListTotalHours(context) {
    return libCrew.getTotalHoursWithDateForCurrentCrew(context, context.getPageProxy().binding.Date).then((hours) => {
        return ConvertDoubleToHourString(hours);
    });
}
