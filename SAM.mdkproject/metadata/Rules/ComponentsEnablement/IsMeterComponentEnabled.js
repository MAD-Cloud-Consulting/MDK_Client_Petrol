import userFeaturesLib from '../UserFeatures/UserFeaturesLibrary';

/**
* Check if Meter Component is Enabled or not
* @param {IClientAPI} clientAPI
*/
export default function IsMeterComponentEnabled(context) {
    return userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Meter.global').getValue());
}
