import libCom from '../../Common/Library/CommonLibrary';
import Logger from '../../Log/Logger';

export default function RoutesListViewNav(clientAPI) {
    Logger.info(clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryPrefs.global').getValue(), 'RoutesListViewNav called');
    libCom.setStateVariable(clientAPI, 'RouteListFilter', 'ALL_ROUTES');
    let overviewClientData = libCom.getClientDataForPage(clientAPI);
    let orderTypesCache = libCom.cacheEntity(clientAPI, 'OrderTypes', '$select=OrderType,PriorityType', ['OrderType'], ['PriorityType'], overviewClientData);
    let prioritiesCache = libCom.cacheEntity(clientAPI, 'Priorities', '$select=PriorityType,Priority,PriorityDescription', ['PriorityType', 'Priority'], ['PriorityDescription'], overviewClientData);
    let preferencesCache = libCom.cacheEntity(clientAPI, 'UserPreferences', "$filter=PreferenceGroup eq 'MARKED_JOBS' and PreferenceValue eq 'true'&$orderby=PreferenceName&$select=PreferenceName", ['PreferenceName'], ['PreferenceName'], overviewClientData); 
    return Promise.all([orderTypesCache, prioritiesCache, preferencesCache]).then(() => {
        clientAPI.executeAction('/SAPAssetManager/Actions/FOW/Routes/RouteListNav.action');
    });
}
