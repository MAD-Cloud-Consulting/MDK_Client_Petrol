export default function DiscardReadings(context) {
    if (context.getPageProxy) {
        context = context.getPageProxy();
    }
    return deleteReadings(context);
}

function deleteReadings(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'] + '/Device_Nav/MeterReadings_Nav', [], '$expand=Device_Nav&$filter=sap.islocal()').then(function(result) {
        if (result && result.length > 0) {
            context.getClientData().binding = result.getItem(0);
            return context.executeAction('/SAPAssetManager/Actions/Meters/CreateUpdate/MeterReadingsDiscard.action').then(function() {
                return deleteReadings(context);
            });
        } else {

            let blockedFlagAction;

            if (context.binding['@sap.inErrorState']) {
                blockedFlagAction = '/SAPAssetManager/Actions/Meters/SetBlockedFlagFalse.action';
            } else {
                blockedFlagAction = '/SAPAssetManager/Actions/Meters/Discard/DiscardBlockedFlag.action';
            }

            return context.executeAction(blockedFlagAction);
        }
    });
}
