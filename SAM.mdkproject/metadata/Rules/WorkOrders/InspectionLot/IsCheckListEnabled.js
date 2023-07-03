import userFeaturesLib from '../../UserFeatures/UserFeaturesLibrary';

export default function IsCheckListEnabled(context) {
    if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Checklist.global').getValue())) {
        return (context.getPageProxy().binding.EAMChecklist_Nav.length >0);
    } else {
        return false;
    }
    
}
