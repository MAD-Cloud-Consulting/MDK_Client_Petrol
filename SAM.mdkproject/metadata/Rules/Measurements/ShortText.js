export default function ShortText(context) {
    return context.getPageProxy().binding.ShortText ? context.getPageProxy().binding.ShortText : '-';
}
