import TimeSheetData from './TimeSheetsData';
import {TimeSheetDetailsLibrary as libTSDetails} from './TimeSheetLibrary'; 
import ConvertDoubleToHourString from '../Confirmations/ConvertDoubleToHourString';

export default function TimeSheetsTodaysHours(context, format=true) {
    return TimeSheetData(context, new Date()).then((results) => {
        return libTSDetails.TimeSheetTotalHoursWithDate(context,results.Date).then((hours) => {
            if (format) {
                return context.localizeText('x_hours', [ConvertDoubleToHourString(hours)]);
            } else {
                return hours;
            }
        }).catch(() => {
            return context.localizeText('x_hours', [ConvertDoubleToHourString(0.0)]);
        });
    }).catch(() => {
        return context.localizeText('x_hours', [ConvertDoubleToHourString(0.0)]);
    });
}
