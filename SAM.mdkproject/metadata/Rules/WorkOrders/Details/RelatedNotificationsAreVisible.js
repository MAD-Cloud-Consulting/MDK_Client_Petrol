import userFeaturesLib from '../../UserFeatures/UserFeaturesLibrary'; 
export default function RelatedNotificationsAreVisible(context) {
    return userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/NotificationHistories.global').getValue());
}
