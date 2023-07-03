import lib from '../LocationTracking/LocationTrackingLibrary';

export default function BeforeAppUpdate(context) {
    if (lib.isNetworkConnected(context)) {
        return context.getPageProxy().executeAction('/SAPAssetManager/Actions/Common/PerformAppUpdateCheck.action');
    }

    return context.getPageProxy().executeAction('/SAPAssetManager/Actions/Common/ServiceUnavailable.action');
}
