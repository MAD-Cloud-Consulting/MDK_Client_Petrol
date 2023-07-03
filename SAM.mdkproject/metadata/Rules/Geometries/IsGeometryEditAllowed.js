
import userFeaturesLib from '../UserFeatures/UserFeaturesLibrary';

export default function IsGeometryEditAllowed(context) {
    let pageProxy = context.evaluateTargetPath('#Page:-Previous');
    let id = '';
    if (pageProxy) {
        id = pageProxy.id;
    }
    return id !== 'MapExtensionControlPage' && id !== 'SideMenuMapExtensionControlPage' &&
        userFeaturesLib.isFeatureEnabled(context,context.getGlobalDefinition('/SAPAssetManager/Globals/Features/GISAddEdit.global').getValue());
}
