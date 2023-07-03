import ConvertMinutesToHourString from '../ConvertMinutesToHourString';
import ConfirmationDurationFromTime from '../ConfirmationDurationFromTime';

export default function ConfirmationFormattedActualDuration(context) {

    let confirmation = context.getBindingObject();
    let actualDuration = ConfirmationDurationFromTime(confirmation);

    return ConvertMinutesToHourString(actualDuration);
}
