import TimeSheetsData from './TimeSheetsData';
import {TimeSheetDetailsLibrary as libTSDetails} from './TimeSheetLibrary'; 
import ConvertDoubleToHourString from '../Confirmations/ConvertDoubleToHourString';

export default function TimeSheetsYesterdaysHours(context, format=true) {
    let date = new Date();
    date.setDate(date.getDate() - 1);
    return TimeSheetsData(context, date).then((results) => {
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
