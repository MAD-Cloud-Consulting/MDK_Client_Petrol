
export default function PriorityBadge(context) {
    let priority = context.binding.Priority;
    if (priority === '1' || priority === '2') {
        return context.getGlobalDefinition('/SAPAssetManager/Globals/Maps/HighPriorityBadge.global').getValue();
    }
    return '';
}
