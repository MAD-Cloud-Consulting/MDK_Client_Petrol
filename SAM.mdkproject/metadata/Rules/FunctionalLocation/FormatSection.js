export default function FormatSection(context) {
    return context.binding.Section !== '' ? context.binding.Section : '-';
}
