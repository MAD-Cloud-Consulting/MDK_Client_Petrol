/**
* Check if QM component is enabled
* @param {IClientAPI} context
*/

import userFeaturesLib from '../UserFeatures/UserFeaturesLibrary';
export default function IsQMComponentEnabled(context) {
    return userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/QM.global').getValue());
}
