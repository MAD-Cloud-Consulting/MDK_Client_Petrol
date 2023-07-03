import ConfirmationDateFromOData from '../ConfirmationDateFromOData';

export default function ConfirmationEndTimeDetails(context) {
    let binding = context.getBindingObject();
    let offsetOdataDate = ConfirmationDateFromOData(context, binding, false);
    return context.formatTime(offsetOdataDate.date());
}
