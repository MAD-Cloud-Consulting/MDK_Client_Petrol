/**
* Describe this function...
* @param {IClientAPI} context
*/
import Logger from '../Log/Logger';
import libCom from '../Common/Library/CommonLibrary';

export default function AppUpdateSuccess(context) {
    let result = context.getActionResult('AppUpdateResult').data;
    Logger.debug('APPLICATION UPDATE', 'App update check result: ' + result);
    if (result.startsWith('Current version is already up to date')) {
        return context.getPageProxy().executeAction('/SAPAssetManager/Actions/Common/LatestVersionMessage.action');
    } else if (result.startsWith('AppUpdate feature is not enabled or no new revision found')) {
        if (libCom.isInitialSync(context)) {
            return context.executeAction('/SAPAssetManager/Rules/OData/Download/DownloadDefiningRequest.js');
        } else {
            return context.getPageProxy().executeAction('/SAPAssetManager/Actions/Common/LatestVersionMessage.action');
        }
    }
}
