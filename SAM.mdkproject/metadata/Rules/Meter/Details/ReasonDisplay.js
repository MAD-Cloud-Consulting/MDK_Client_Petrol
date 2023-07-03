export default function ReasonDisplay(context) {
    let activityReason = '';

    if (context.getPageProxy().binding.Device_Nav) {
        activityReason = context.getPageProxy().binding.Device_Nav.ActivityReason;
    } else {
        activityReason = context.getPageProxy().binding.ActivityReason;
    }
    if (activityReason) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', `ActivityReasons('${activityReason}')`, [], '').then(function(result) {
            let reason;
            if (result && (reason = result.getItem(0))) {
                return activityReason + ' - ' + reason.Description;
            } else {
                return '-';
            }
        });
    } else {
        return '-';
    }
}
