export default function SerialNumberTitle(context) {
    if (context.binding.new) {
        return context.binding.SerialNumber + ' - ' + context.localizeText('New');
    } else {
        return context.binding.SerialNumber;
    }
}
