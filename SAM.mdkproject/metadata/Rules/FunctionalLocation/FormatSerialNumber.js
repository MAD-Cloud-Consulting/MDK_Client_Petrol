export default function FormatSerialNumber(context) {
    return context.binding.SerialNumber !== '' ? context.binding.SerialNumber : '-';
}
