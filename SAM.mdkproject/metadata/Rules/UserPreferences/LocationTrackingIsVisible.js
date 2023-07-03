
import libLocationTracking from '../LocationTracking/LocationTrackingLibrary';
import libFeature from '../UserFeatures/UserFeaturesLibrary';

export default function LocationTrackingIsVisible(context) {
    return libFeature.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/LocationUpdate.global').getValue()) &&
           libLocationTracking.isAllowOverride(context);
}
