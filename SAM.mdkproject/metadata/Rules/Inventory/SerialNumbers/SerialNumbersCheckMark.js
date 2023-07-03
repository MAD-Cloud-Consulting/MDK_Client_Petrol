export default function SerialNumbersCheckMark(context) {
    const target = context.binding;
    if (target.selected) {
        return 'checkmark';
    } else {
        return '';
    }
}
