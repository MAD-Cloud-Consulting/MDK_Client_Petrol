import userFeaturesLib from '../UserFeatures/UserFeaturesLibrary';

export default function GISAddEditEnabled(context) {
    return userFeaturesLib.isFeatureEnabled(context,context.getGlobalDefinition('/SAPAssetManager/Globals/Features/GISAddEdit.global').getValue());
}
