export default function ReasonDisplay(context) {
    if (context.getPageProxy().binding.Device_Nav.ActivityReason) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', `ActivityReasons('${context.getPageProxy().binding.Device_Nav.ActivityReason}')`, [], '').then(function(result) {
            let reason;
            if (result && (reason = result.getItem(0))) {
                return context.getPageProxy().binding.Device_Nav.ActivityReason + ' - ' + reason.Description;
            } else {
                return '-';
            }
        });
    } else {
        return '-';
    }
}
