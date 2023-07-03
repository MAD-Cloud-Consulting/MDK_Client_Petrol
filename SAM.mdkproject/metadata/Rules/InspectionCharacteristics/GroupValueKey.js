export default function GroupValueKey(context) {
    if (context.getPageProxy().binding.QuantitativeFlag) {
        return context.localizeText('value');
    } else {
        return context.localizeText('group');
    }
}
