
export default function WorkOrderHistoryLongText(context) {
    if (context.binding.LongTextExists === 'E') {
        let historyLongText = context.binding.HistoryLongText;
        if (historyLongText.hasOwnProperty('TextString')) {
            return historyLongText.TextString;
        } else {
            return '';
        }
    } else {
        return '';
    }
}
