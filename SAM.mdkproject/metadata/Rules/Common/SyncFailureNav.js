import errorLibrary from './Library/ErrorLibrary';
import libVal from './Library/ValidationLibrary';
import isAndroid from './IsAndroid';

export default function SyncFailureNav(context) {
    context.getPageProxy().getClientData().SlideOutMenu = false;
    if (!libVal.evalIsEmpty(errorLibrary.getErrorMessage(context))) {
        if (isAndroid(context)) {
            return context.executeAction('/SAPAssetManager/Actions/SyncError/SyncErrorDetailsAndroid.action');
        }
        return context.executeAction('/SAPAssetManager/Actions/SyncError/SyncErrorDetails.action');
    }
    return context.executeAction('/SAPAssetManager/Actions/ErrorArchive/ErrorsArchive.action');
}
