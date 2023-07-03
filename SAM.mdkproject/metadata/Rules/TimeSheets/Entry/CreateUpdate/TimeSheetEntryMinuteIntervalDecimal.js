import minutesFunction from './TimeSheetEntryMinuteInterval';

export default function getCATSMinuteIntervalDecimal(context) {

    let minutes = minutesFunction(context);
    return Math.round(minutes/60 * 100) / 100; //Get the decimal value
}
