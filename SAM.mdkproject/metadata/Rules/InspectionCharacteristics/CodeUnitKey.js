export default function CodeUnitKey(context) {
    if (context.getPageProxy().binding.QuantitativeFlag) {
        return context.localizeText('unit');
    } else {
        return context.localizeText('code');
    }
}
