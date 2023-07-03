/**
* Check if FOW component is enabled
* @param {IClientAPI} context
*/

import userFeaturesLib from '../UserFeatures/UserFeaturesLibrary';
export default function IsFOWComponentEnabled(context) {
    return userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/FOW.global').getValue());
}
