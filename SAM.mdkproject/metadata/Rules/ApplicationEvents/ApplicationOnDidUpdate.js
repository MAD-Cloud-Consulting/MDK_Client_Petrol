import Logger from '../Log/Logger';
import DownloadDefiningRequest from '../OData/Download/DownloadDefiningRequest';

export default function ApplicationOnDidUpdate(clientAPI) {
    Logger.init(clientAPI);
    return clientAPI.executeAction('/SAPAssetManager/Actions/Common/AppUpdateSuccess.action').then(() => {
      return DownloadDefiningRequest(clientAPI).then(success => {
        return Promise.resolve(success);
      }).catch((failure) => {
        Logger.error('AppOnDidUpdateFailure', failure);
        return Promise.reject(clientAPI.localizeText('offline_odata_initialization_failed'));
      });
    });
}
