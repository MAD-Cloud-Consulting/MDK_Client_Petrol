import enableCreate from '../../UserAuthorizations/Confirmations/EnableConfirmationCreate';

export default function ConfirmationEntryCreateVisible(context) {

    //Do not allow user to add time for this restricted date, because it is in the future.
    if (context.binding && context.binding.PostingDate) {
        var currentDate = new Date().toISOString().substr(0, 10);
        let dateBound;

        if (typeof context.binding.PostingDate.toISOString === 'function') { //Date
            dateBound = context.binding.PostingDate.toISOString().substr(0, 10);
        } else { //String date
            dateBound = context.binding.PostingDate.substr(0, 10);
        }

        if (currentDate < dateBound) {
            return false;
        }
    }
    return enableCreate(context);
}
