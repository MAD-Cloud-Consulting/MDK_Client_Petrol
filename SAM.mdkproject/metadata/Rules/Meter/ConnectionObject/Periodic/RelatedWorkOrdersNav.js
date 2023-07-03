export default function RelatedNotificationsNav(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'] + '/ConnectionObject_Nav/FuncLocation_Nav', [], '').then(function(result) {
        context.getPageProxy().setActionBinding(result.getItem(0));
        return context.executeAction('/SAPAssetManager/Actions/WorkOrders/WorkOrderRelatedHistoriesListViewNav.action');
    });
}
