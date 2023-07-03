import userFeaturesLib from '../UserFeatures/UserFeaturesLibrary';

export default function IsEventPriorityMatrixEnabled(context) {
    return userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/EventPriorityMatrix.global').getValue());
}
