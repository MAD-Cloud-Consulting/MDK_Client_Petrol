import OffsetODataDate from '../Common/Date/OffsetODataDate';
import libCommon from '../Common/Library/CommonLibrary';

export default function ExpensesDate(context) {
    if (libCommon.isDefined(context.binding.StartDate)) {
        let odataDate = new OffsetODataDate(context, context.binding.StartDate,context.binding.StartTime);
        return context.formatDate(odataDate.date());
    } else {
        return context.localizeText('no_due_date');
	}
}
