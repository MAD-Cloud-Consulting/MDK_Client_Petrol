export default function UserText(context) {
    return context.binding.Inspector ? context.binding.Inspector : '-';
}
