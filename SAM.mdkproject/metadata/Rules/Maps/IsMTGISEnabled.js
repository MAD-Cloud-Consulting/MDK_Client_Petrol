import enableMaintenanceTechnician from '../SideDrawer/EnableMaintenanceTechnician';
import userFeaturesLib from '../UserFeatures/UserFeaturesLibrary';

export default function IsMTGISEnabled(context) {
    if (enableMaintenanceTechnician(context)) {
        return userFeaturesLib.isFeatureEnabled(context,context.getGlobalDefinition('/SAPAssetManager/Globals/Features/GIS.global').getValue());
    }
    return false;
}
