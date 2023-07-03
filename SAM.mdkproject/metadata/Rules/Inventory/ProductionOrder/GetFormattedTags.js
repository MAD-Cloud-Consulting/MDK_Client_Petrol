export default function GetFormattedTags(context) {
    const binding = context.binding;
    if (binding) {
        const tags = [];
        if (binding.ProductionPlant) {
            tags.push(binding.ProductionPlant);
        }
        if (binding.OrderType) {
            tags.push(binding.OrderType);
        }
        // no status info for now, should be updated while adding goods issue/receipt
        // TODO:PRD harcoding value as Open - temporarily
        tags.push(context.localizeText('open'));
        return tags;
    }
    return [];
}
