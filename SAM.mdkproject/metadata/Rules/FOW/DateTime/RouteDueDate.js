import libFormat from '../Common/Library/FormatLibrary';
import validation from '../../Common/Library/ValidationLibrary';
 
export default function RouteDueDate(context) {
    if (!validation.evalIsEmpty(context.binding.WorkOrder)) {
        let dueDate = context.binding.WorkOrder.DueDate;
        return libFormat.formatRouteDueDate(context, dueDate);
    }
    if (!validation.evalIsEmpty(context.binding.ScheduledStartDate)) {
        let dueDate = context.binding.ScheduledStartDate;
        return libFormat.formatRouteDueDate(context, dueDate);
    }
    return '';
}
