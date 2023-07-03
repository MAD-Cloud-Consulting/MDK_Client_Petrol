import Logger from '../Log/Logger';
import libCom from '../Common/Library/CommonLibrary';
import DownloadDefiningRequest from '../OData/Download/DownloadDefiningRequest';


export default function ApplicationOnWillUpdate(clientAPI) {
    Logger.debug('APPLICATION ON WILLUPDATE', 'Called ');

    return clientAPI.executeAction('/SAPAssetManager/Actions/Common/AppWillUpdate.action').then((result) => {
        /**Implementing our Logger class*/
        Logger.debug('APPLICATION ON WILLUPDATE', 'Update now? ' + result.data);

        if (result.data === true) {
            // Resolve to update metadata
            return Promise.resolve(result);
        } else {
            if (libCom.isInitialSync(clientAPI)) {
                return continueWithInitialization(clientAPI);
            } else {
                // this is the case when app update check was manually triggered from user profile, or initiated from MDK. 
                return Promise.reject(false);
            }
        }
    });
}

export function continueWithInitialization(clientAPI) {
    return DownloadDefiningRequest(clientAPI).then(() => {
        // Reject the promise to prevent metadata update.
        return Promise.reject(false);
      }).catch((failure) => {
        Logger.error('AppOnDidUpdateFailure', failure);
        return Promise.reject(clientAPI.localizeText('offline_odata_initialization_failed'));
      });
}
