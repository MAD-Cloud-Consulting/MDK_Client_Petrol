

import userFeaturesLib from '../UserFeatures/UserFeaturesLibrary';

export default function ConfirmationsIsEnabled(context) {
    return userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/PMConfirmation.global').getValue());
}
