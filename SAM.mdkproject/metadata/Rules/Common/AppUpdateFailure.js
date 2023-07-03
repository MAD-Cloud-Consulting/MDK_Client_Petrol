/**
* Describe this function...
* @param {IClientAPI} context
*/
import Logger from '../Log/Logger';
import libCom from '../Common/Library/CommonLibrary';

export default function AppUpdateFailure(context) {
    let result = context.getActionResult('AppUpdateResult').error;
    Logger.debug('APPLICATION UPDATE', 'App update check result: ' + result);

    if (libCom.isInitialSync(context)) {
        Logger.debug('APPLICATION UPDATE', 'Continuing with normal initialization');
        return context.executeAction('/SAPAssetManager/Rules/OData/Download/DownloadDefiningRequest.js');
    } else {
        // this is the case when app update check was manually triggered from user profile, or initiated from MDK. 
        return context.executeAction('/SAPAssetManager/Actions/Common/AppUpdateFailure.action');
    }
}
