import enableTimeCreate from '../../../UserAuthorizations/TimeSheets/EnableTimeSheetCreate';
export default function TimeSheetEntryCreateVisible(context) {

    //Do not allow user to add time for this restricted date, because it is in the future.
    if (context.binding && context.binding.Date) {
        var currentDate = new Date().toISOString().substr(0, 10);
        let dateBound;

        if (typeof context.binding.Date.toISOString === 'function') { //Date
            dateBound = context.binding.Date.toISOString().substr(0, 10);
        } else { //String date
            dateBound = context.binding.Date.substr(0, 10);
        }

        if (currentDate < dateBound) {
            return false;
        }
    }
    return enableTimeCreate(context);
}
