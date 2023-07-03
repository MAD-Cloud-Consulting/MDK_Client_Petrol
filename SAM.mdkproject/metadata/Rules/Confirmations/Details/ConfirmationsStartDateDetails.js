import ConfirmationDateFromOData from '../ConfirmationDateFromOData';

export default function ConfirmationsStartDateDetails(context) {
    let binding = context.getBindingObject();
    let offsetOdataDate = ConfirmationDateFromOData(context, binding, true);
    return context.formatDatetime(offsetOdataDate.date());
}
