import TimeCaptureTypeHelper from './TimeCaptureTypeHelper';
import TimeSheetYesterdayHours from '../../TimeSheets/TimeSheetsYesterdaysHours';
import {TimeSheetLibrary as libTS} from '../../TimeSheets/TimeSheetLibrary';

export default function SubHeadFontColorYesterday(context) {
   return TimeCaptureTypeHelper(context, ConfirmationYesterdayHours, TimeSheetsYesterdayHours);
}

export function ConfirmationYesterdayHours() {
    return Promise.resolve();
}
export function TimeSheetsYesterdayHours(context) {
    return TimeSheetYesterdayHours(context,false).then(result => {
        let completionTimeHours = libTS.getTimesheetCompletionHours(context);
        if (result< completionTimeHours) {
            return Promise.resolve('ResetRed');
        }
        return Promise.resolve();
    });
}
