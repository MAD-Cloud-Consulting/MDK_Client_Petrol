export default function FormatManufacturer(context) {
    return context.binding.Manufacturer !== '' ? context.binding.Manufacturer : '-';
}
