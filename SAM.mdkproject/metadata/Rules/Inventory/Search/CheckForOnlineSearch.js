import libCom from '../../Common/Library/CommonLibrary';
import isSyncInProgress from '../../Sync/IsSyncInProgress';
/**
* Function which should be triggered after query options are changed
* It checks the count of available documents (with use of data from query options)
* and depending on the count perform some actions:
* 0 - start online search (if it's enabled in app params)
* 1 - open document details page
* 2 or more - no further reaction
* @param {IClientAPI} context
* @param {string} entitySet
* @param {DataQueryBuilder} queryOptions
* @param {string} searchValue
*/
export default function CheckForOnlineSearch(context, entitySet, queryOptions, searchValue, page) {
    let prevStateLabel = 'PrevState' + page;
    const minCharacters = Number.parseInt(libCom.getAppParam(context, 'INVENTORY', 'search.minimum.characters'));
    const onlineSearchEnabled = (libCom.getAppParam(context, 'INVENTORY', 'search.online') === 'Y');
    const autoOpenEnabled = (libCom.getAppParam(context, 'INVENTORY', 'search.auto.navigate') === 'Y');
    if (searchValue && minCharacters && searchValue.length >= minCharacters && (onlineSearchEnabled || autoOpenEnabled)) {
        return queryOptions.build().then(options => {
            return context.count('/SAPAssetManager/Services/AssetManager.service', entitySet, options).then(count => {
                let state = libCom.getStateVariable(context, prevStateLabel);
                let syncInProgress = isSyncInProgress(context);
                let downloadStarted = libCom.getStateVariable(context, 'DownloadIMDocsStarted');
                if (state !== searchValue && searchValue !== undefined) {
                    libCom.setStateVariable(context, prevStateLabel, searchValue);
                    if (!syncInProgress && !downloadStarted) {
                        switch (count) {
                            case 0:
                                if (onlineSearchEnabled) {
                                    libCom.setStateVariable(context, 'SearchStringOnline', searchValue);
                                    return context.executeAction('/SAPAssetManager/Actions/Inventory/Search/SearchDocumentsProgressBanner.action');
                                }
                                break;
                            case 1:
                                if (autoOpenEnabled) {
                                    return libCom.openInventoryDocDetailsPage(context, entitySet, options);
                                }
                                break;
                            default:
                                break;
                        }
                    }
                }
                return queryOptions;
            });
        });
    } else {
        libCom.setStateVariable(context, 'SearchStringOnline', '');
        libCom.setStateVariable(context, prevStateLabel, '');
    }
    return queryOptions;
}
