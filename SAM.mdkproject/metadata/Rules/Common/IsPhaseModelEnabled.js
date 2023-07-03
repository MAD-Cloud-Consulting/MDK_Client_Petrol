import userFeaturesLib from '../UserFeatures/UserFeaturesLibrary';

export default function IsPhaseModelEnabled(context) {
    return userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/PhaseModel.global').getValue());
}
