
export default function RoutePriorityStatusText(context) {
    let priority = context.binding.WorkOrder.WOPriority.Priority;
    let text = '';
    switch (priority) {
        case '1':
            text = context.localizeText('very_high');
            break;
        case '2':
            text = context.localizeText('high');
            break;
        case '3':
            text = context.localizeText('medium');
            break;
        case '4':
            text = context.localizeText('low');
            break;
        default:
            return '';
    }
    return text;
}
