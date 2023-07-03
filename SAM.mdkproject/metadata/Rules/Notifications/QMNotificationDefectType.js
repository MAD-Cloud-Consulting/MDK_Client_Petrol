export default function QMNotificationDefectType(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', `OrderTypes(OrderType='${context.binding.InspectionLot_Nav.WOHeader_Nav.OrderType}', PlanningPlant='${context.binding.InspectionLot_Nav.WOHeader_Nav.PlanningPlant}')`, [], '').then(result => {
        if (result && result.length > 0) {
            return result.getItem(0).QMNotifType;
        } else {
            return 'QM';
        }
    });
}
