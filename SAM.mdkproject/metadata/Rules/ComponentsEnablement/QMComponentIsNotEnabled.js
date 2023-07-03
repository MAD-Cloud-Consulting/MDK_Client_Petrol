import userFeaturesLib from '../UserFeatures/UserFeaturesLibrary';
export default function NonQMFieldsEnable(context) {
    return !userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/QM.global').getValue());
}
