import userFeaturesLib from '../UserFeatures/UserFeaturesLibrary';

export default function EnabledChecklistSideMenu(context) {
    if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Checklist.global').getValue())) {
        return true;
    } else {
        return false;
    }
    
}
