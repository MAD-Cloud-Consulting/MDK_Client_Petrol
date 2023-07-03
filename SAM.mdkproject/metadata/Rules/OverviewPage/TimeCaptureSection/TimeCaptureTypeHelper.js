
import ConfirmationsIsEnabled from '../../Confirmations/ConfirmationsIsEnabled';
import TimeSheetsIsEnabled from '../../TimeSheets/TimeSheetsIsEnabled';

export default function TimeCaptureTypeHelper(context, onConfirmations, onTimeSheets) {

    if (ConfirmationsIsEnabled(context)) {
        return onConfirmations(context);
    } else if (TimeSheetsIsEnabled(context)) {
        return onTimeSheets(context);
    }
}
