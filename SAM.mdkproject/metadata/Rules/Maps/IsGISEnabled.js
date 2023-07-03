import enableMaintenanceTechnician from '../SideDrawer/EnableMaintenanceTechnician';
import enableFieldServiceTechnician from '../SideDrawer/EnableFieldServiceTechnician';
import userFeaturesLib from '../UserFeatures/UserFeaturesLibrary';

export default function IsGISEnabled(context) {
    if (enableMaintenanceTechnician(context) || enableFieldServiceTechnician(context) ) {
        return userFeaturesLib.isFeatureEnabled(context,context.getGlobalDefinition('/SAPAssetManager/Globals/Features/GIS.global').getValue());
    }
    return false;
}
