import userFeaturesLib from '../UserFeatures/UserFeaturesLibrary';
export default function AssetCentralComponentIsEnabled(context) {
    ///Checks if IAM_INDICATORS (Asset Central) is enabled
    return userFeaturesLib.isFeatureEnabled(context,context.getGlobalDefinition('/SAPAssetManager/Globals/Features/AssetCentral.global').getValue());
 }
