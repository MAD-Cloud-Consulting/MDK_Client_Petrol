import UserFeaturesLibrary from '../UserFeatures/UserFeaturesLibrary';

export default function IsServiceReportEnabled(context) {
    return UserFeaturesLibrary.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/ServiceReport.global').getValue());

}
