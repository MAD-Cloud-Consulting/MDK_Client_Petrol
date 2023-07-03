import ConfirmationDateFromOData from '../ConfirmationDateFromOData';

export default function ConfirmationsFinishDateDetails(context) {
    let binding = context.getBindingObject();
    let offsetOdataDate = ConfirmationDateFromOData(context, binding, false);
    return context.formatDatetime(offsetOdataDate.date());
}
