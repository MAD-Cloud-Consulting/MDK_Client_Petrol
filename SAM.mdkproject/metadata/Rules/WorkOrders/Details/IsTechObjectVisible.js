import userFeaturesLib from '../../UserFeatures/UserFeaturesLibrary';

export default function TechObjectSectionIsVisble(context) {
    if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Meter.global').getValue())) {
        
        // Don't show equipment or floc section for Meter order
        return !(context.getPageProxy().binding.OrderISULinks && context.getPageProxy().binding.OrderISULinks.length > 0);
    } 
    return true;
}
