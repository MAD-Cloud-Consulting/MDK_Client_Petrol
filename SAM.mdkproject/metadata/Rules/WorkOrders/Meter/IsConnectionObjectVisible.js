import userFeaturesLib from '../../UserFeatures/UserFeaturesLibrary';

export default function IsConnectionObjectVisble(context) {
    if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Meter.global').getValue())) {
        
        // Show connection object for meter work order
        return (context.getPageProxy().binding.OrderISULinks && context.getPageProxy().binding.OrderISULinks.length > 0);
    } 
    return false;
}
