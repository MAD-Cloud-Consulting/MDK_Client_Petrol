export default function RelatedActivitiesNav(context) {
    let actType = context.binding.OrderISULinks[0].ISUProcess === 'DISCONNECT' ? '01' : '03';
    return context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'] + '/DisconnectActivity_Nav', [], `$expand=DisconnectActivityType_Nav,DisconnectActivityStatus_Nav,DisconnectDoc_Nav/DisconnectDocStatus_Nav,DisconnectDoc_Nav/ProcessVariant_Nav,DisconnectDoc_Nav/DisconnectReason_Nav&$filter=ActivityType eq '${actType}'`).then(function(result) {
        if (result && result.length > 0) {
            context.getPageProxy().setActionBinding(result.getItem(0));
            return context.executeAction('/SAPAssetManager/Actions/WorkOrders/Meter/RelatedActivitiesNav.action');
        } else {
            return 0;
        }
    });
}
