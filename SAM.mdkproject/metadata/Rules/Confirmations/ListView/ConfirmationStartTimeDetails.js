import ConfirmationDateFromOData from '../ConfirmationDateFromOData';

export default function ConfirmationStartTimeDetails(context) {
    let binding = context.getBindingObject();
    let offsetOdataDate = ConfirmationDateFromOData(context, binding, true);
    return context.formatTime(offsetOdataDate.date());
}
