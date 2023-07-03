import libCom from '../../Common/Library/CommonLibrary';
import DownloadDocuments from '../Fetch/DownloadDocuments';
import inventoryObjectsQueryOptions from '../Fetch/InventoryObjectsQueryOptions';
/**
* Function which is called after initializing of online services
* It check amount of available documents in the online service depending on entered data
* If data is not exist in SearchStringOnline state variable it means that function is triggered by
* FetchDocuments page, not search field. So all data (QueryOptions) is taken out from there
* If function is triggered from search bar, than we mannualy set required filter values for creating Query options
* After getting of the count of the documents in the online service we have 3 ways of reaction:
* 0 - show error message (documents not found)
* 1 - automatically call download funtions with details of the document
* 2 and more - we open FetchDocumentsOnline page to provide to user ability to choose documents
* @param {IClientAPI} context
*/
export default async function TriggerOnlineSearch(context) {
    let searchString = libCom.getStateVariable(context, 'SearchStringOnline');
    let downloadStarted = libCom.getStateVariable(context, 'DownloadIMDocsStarted');
    if (libCom.isDefined(searchString) && context.currentPage 
        && context.currentPage.id !== 'FetchDocumentsPage' && context.currentPage.id !== 'FetchOnlineDocumentsPage') {
        context.evaluateTargetPathForAPI('#Page:InventoryOverview').getClientData().DocumentID = searchString;
        context.evaluateTargetPathForAPI('#Page:InventoryOverview').getClientData().DocumentType = { length: 0 };
        context.evaluateTargetPathForAPI('#Page:InventoryOverview').getClientData().Plant = [{ ReturnValue: libCom.getUserDefaultPlant()}];
        context.evaluateTargetPathForAPI('#Page:InventoryOverview').getClientData().Sloc = [];
    }
    let customQuery = inventoryObjectsQueryOptions(context);
    if (!downloadStarted) {
        return customQuery.build().then(options => {
            return context.count('/SAPAssetManager/Services/OnlineAssetManager.service', 'InventoryObjects', options).then(count => {
                switch (count) {
                    case 0:
                        return context.executeAction({
                            'Name': '/SAPAssetManager/Actions/SyncErrorBannerMessage.action',
                            'Properties': {
                                'Message': context.localizeText('no_documents_found_on_online_search'),
                            },
                        });
                    case 1:
                        return context.read('/SAPAssetManager/Services/OnlineAssetManager.service', 'InventoryObjects', [], options).then(data => {
                            if (data.length === 1) {
                                let item = data.getItem(0);
                                let documents = [];
                                let document = Object();
                                document.ObjectId = item.ObjectId;
                                document.OrderId = item.OrderId;
                                document.IMObject = item.IMObject;
                                documents[0] = document;
                                context.evaluateTargetPathForAPI('#Page:InventoryOverview').getClientData().Documents = documents;
                                libCom.setStateVariable(context, 'DownloadIMDocsStarted', true);
                                return DownloadDocuments(context, 0);
                            }
                            return false;
                        });
                    default: {
                        context.executeAction('/SAPAssetManager/Actions/Inventory/Fetch/FetchDocumentsOnline.action');
                        
                        //return true to close progress banner message
                        return true;
                    }
                } 
            });
        });
    }
}
