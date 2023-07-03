/**
* Check if Crew component is enabled to show member list inside Time Sheet
* @param {IClientAPI} context
*/
import userFeaturesLib from '../UserFeatures/UserFeaturesLibrary';
export default function IsCrewComponentEnabled(context) {
    return userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Crew.global').getValue());
}
