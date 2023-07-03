import userFeaturesLib from '../../UserFeatures/UserFeaturesLibrary';

export default function PRTIsVisible(context) {
    return userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/PRT.global').getValue());
}
