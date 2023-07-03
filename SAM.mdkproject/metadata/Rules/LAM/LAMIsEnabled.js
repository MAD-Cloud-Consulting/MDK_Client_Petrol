import userFeaturesLib from '../UserFeatures/UserFeaturesLibrary';

export default function LAMIsEnabled(context) {
    return userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/LAM.global').getValue());
}
