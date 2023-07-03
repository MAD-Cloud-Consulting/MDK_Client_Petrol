import userFeaturesLib from '../../UserFeatures/UserFeaturesLibrary';

export default function BOMVisible(context) {
    if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/BOM.global').getValue())) {
        if (context.binding.BoMFlag === 'X') {
            return true;
        }
        return false;
    }
    return false;
}
