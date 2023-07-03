/**
* Describe this function...
* @param {IClientAPI} context
*/
import DownloadDefiningRequest from '../OData/Download/DownloadDefiningRequest';
import libCom from '../Common/Library/CommonLibrary';

export default function PerformAppUpdateCheck(context) {
    // skip app update check if in demo mode or not initial sync
    if (!libCom.isInitialSync(context) || context.isDemoMode()) {
        return DownloadDefiningRequest(context);           
    } else if (libCom.isInitialSync(context)) {
        return context.executeAction('/SAPAssetManager/Actions/Common/PerformAppUpdateCheck.action');
    }
}

