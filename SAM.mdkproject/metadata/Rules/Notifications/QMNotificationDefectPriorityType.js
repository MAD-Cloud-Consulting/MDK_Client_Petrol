export default function QMNotificationDefectPriorityType(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', `OrderTypes(OrderType='${context.binding.InspectionLot_Nav.WOHeader_Nav.OrderType}', PlanningPlant='${context.binding.InspectionLot_Nav.WOHeader_Nav.PlanningPlant}')`, [], '').then(result => {
        if (result && result.length > 0) {
            return context.read('/SAPAssetManager/Services/AssetManager.service', `NotificationTypes('${result.getItem(0).QMNotifType}')`, [], '').then(priorityResult => {
                return priorityResult.getItem(0).PriorityType;
            });
        } else {
            return 'QM';
        }
    });
}
