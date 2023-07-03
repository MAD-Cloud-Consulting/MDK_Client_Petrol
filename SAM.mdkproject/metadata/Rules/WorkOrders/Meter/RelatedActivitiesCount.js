export default function RelatedActivitiesCount(context) {
    return context.count('/SAPAssetManager/Services/AssetManager.service', context.getPageProxy().binding.DisconnectActivity_Nav[0]['@odata.readLink'] + '/DisconnectDoc_Nav/DisconnectActivity_Nav', '');
}
