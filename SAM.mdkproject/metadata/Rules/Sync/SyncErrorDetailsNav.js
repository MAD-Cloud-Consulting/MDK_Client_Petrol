import errorLibrary from '../Common/Library/ErrorLibrary';
import libVal from '../Common/Library/ValidationLibrary';
import isAndroid from '../Common/IsAndroid';

export default function SyncFailureNav(context) {
    if (!libVal.evalIsEmpty(errorLibrary.getErrorMessage(context))) {
        context.evaluateTargetPathForAPI('#Page:-Previous').getClientData().SlideOutMenu = true;
        if (isAndroid(context)) {
            return context.executeAction('/SAPAssetManager/Actions/SyncError/SyncErrorDetailsAndroid.action');
        }
        return context.executeAction('/SAPAssetManager/Actions/SyncError/SyncErrorDetails.action');
    }

    return true;
}
