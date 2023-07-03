export default function FormatModelNumber(context) {
    return context.binding.ModelNumber !== '' ? context.binding.ModelNumber : '-';
}
