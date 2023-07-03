import enableFieldServiceTechnician from '../SideDrawer/EnableFieldServiceTechnician';
import userFeaturesLib from '../UserFeatures/UserFeaturesLibrary';

export default function IsFSMGISEnabled(context) {
    if (enableFieldServiceTechnician(context)) {
        return userFeaturesLib.isFeatureEnabled(context,context.getGlobalDefinition('/SAPAssetManager/Globals/Features/GIS.global').getValue());
    }
    return false;
}
