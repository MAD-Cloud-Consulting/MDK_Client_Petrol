import TimeCaptureTypeHelper from './TimeCaptureTypeHelper';
import TimeSheetTodayHours from '../../TimeSheets/TimeSheetsTodaysHours';
import {TimeSheetLibrary as libTS} from '../../TimeSheets/TimeSheetLibrary';

export default function SubHeadFontColorToday(context) {
   return TimeCaptureTypeHelper(context, ConfirmationTodayHours, TimeSheetsTodayHours);
}

export function ConfirmationTodayHours() {
    return Promise.resolve();
}
export function TimeSheetsTodayHours(context) {
    return TimeSheetTodayHours(context,false).then(result => {
        let completionTimeHours = libTS.getTimesheetCompletionHours(context);
        if (result< completionTimeHours) {
            return Promise.resolve('ResetRed');
        }
        return Promise.resolve();
    });
}
