
export default function RoutePriorityBadge(context) {
    let priority = context.binding.WorkOrder.WOPriority.Priority;
    if (priority === '1' || priority === '2') {
        return context.getGlobalDefinition('/SAPAssetManager/Globals/Maps/HighPriorityBadge.global').getValue();
    }
    return '';
}
