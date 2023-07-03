import Logger from '../../Log/Logger';
import triggerOnlineSearch from '../Search/TriggerOnlineSearch';
import libCom from '../../Common/Library/CommonLibrary';
/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function FetchDocumentsOnline(context) {
    let downloadStarted = libCom.getStateVariable(context, 'DownloadIMDocsStarted');
    if (!downloadStarted) {
        context.updateProgressBanner(context.localizeText('initialize_online_service'));
        return context.executeAction('/SAPAssetManager/Actions/OData/CreateOnlineOData.action').then(function() {
            context.updateProgressBanner(context.localizeText('open_online_service'));
            context.updateProgressBanner(context.localizeText('fetch_documents'));
            context.evaluateTargetPathForAPI('#Page:InventoryOverview').getClientData().Documents = [];
            return triggerOnlineSearch(context);
        }).catch(function(err) {
            Logger.error(`Failed to initialize Online OData Service: ${err}`);
            return context.executeAction('/SAPAssetManager/Actions/SyncErrorBannerMessage.action');
        });
    }
    return Promise.resolve();
}
