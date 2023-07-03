import userFeaturesLib from '../../UserFeatures/UserFeaturesLibrary';
export default function RelatedWorkOrdersAreVisible(context) {
    return userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/WorkOrderHistories.global').getValue());
}
