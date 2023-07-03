import commonLib from '../../Common/Library/CommonLibrary';
import userFeaturesLib from '../../UserFeatures/UserFeaturesLibrary';

export default function AssemblyIsVisible(context) {
    const assemblyEnabled = userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Assembly.global').getValue());
    const assemblyExistsForOrder = commonLib.isDefined(context.getPageProxy().binding.Assembly);
    return assemblyEnabled && assemblyExistsForOrder; // Hide if no Assembly exists, even if enabled.
}
