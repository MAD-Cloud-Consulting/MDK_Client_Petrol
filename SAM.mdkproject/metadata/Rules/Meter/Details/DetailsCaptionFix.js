export default function DetailsCaptionFix(context) {
    if (context.binding.Device_Nav) {
        return context.localizeText('meter_x', [context.binding.Device_Nav.Device]);
    } else {
        return context.localizeText('meter_x', [context.binding.Device]);
    }
}
