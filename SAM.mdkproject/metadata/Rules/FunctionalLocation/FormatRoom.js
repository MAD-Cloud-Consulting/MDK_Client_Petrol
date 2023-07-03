export default function FormatRoom(context) {
    return context.binding.Room !== '' ? context.binding.Room : '-';
}
