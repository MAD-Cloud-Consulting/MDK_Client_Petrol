import UserFeaturesLibrary from '../../UserFeatures/UserFeaturesLibrary';

export default function MileageIsEnabled(context) {
    return UserFeaturesLibrary.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/MileageReport.global').getValue());
}
