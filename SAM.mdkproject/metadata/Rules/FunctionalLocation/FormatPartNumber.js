export default function FormatPartNumber(context) {
    return context.binding.PartNumber !== '' ? context.binding.PartNumber : '-';
}
