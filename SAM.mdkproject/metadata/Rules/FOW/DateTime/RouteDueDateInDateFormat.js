import libFormat from '../Common/Library/FormatLibrary';

//format:MM-dd-yyyy
export default function RouteDueDateInDateFormat(context) {
    let workOrder = context.binding.WorkOrder;
    if (workOrder) {
        return libFormat.formatDate(context, workOrder.DueDate);
    }

    if (context.binding.DueDate) {
        return libFormat.formatDate(context, context.binding.DueDate);
    }

    return '';
}

