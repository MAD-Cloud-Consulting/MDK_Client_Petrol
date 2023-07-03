export default function QMNotificationCreateQueryOptions(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', `OrderTypes(OrderType='${context.binding.InspectionLot_Nav.WOHeader_Nav.OrderType}', PlanningPlant='${context.binding.InspectionLot_Nav.WOHeader_Nav.PlanningPlant}')`, [], '').then(result => {
        if (result && result.length > 0) {
            return context.read('/SAPAssetManager/Services/AssetManager.service', `NotificationTypes('${result.getItem(0).QMNotifType}')`, [], '').then(priorityResult => {
                return `$filter=PriorityType eq '${priorityResult.getItem(0).PriorityType}'&$orderby=Priority`;
            });
        } else {
            return "$filter=PriorityType eq 'QM'&$orderby=Priority";
        }
    });
}
