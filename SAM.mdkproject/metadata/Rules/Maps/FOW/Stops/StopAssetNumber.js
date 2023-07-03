export default function StopAssetNumber(context) {
    if (context.binding && context.binding.TechObjects) {
        return context.binding.TechObjects.length;
    } else {
        return 0;
    }
}
