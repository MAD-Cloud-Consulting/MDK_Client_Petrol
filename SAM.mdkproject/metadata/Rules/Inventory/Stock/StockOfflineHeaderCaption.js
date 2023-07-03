import Logger from '../../Log/Logger';
import EnableInventoryClerk from '../../SideDrawer/EnableInventoryClerk';
import libCom from '../../Common/Library/CommonLibrary';

/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function StockOfflineHeaderCaption(context) {
    let queryOption = '';
    let offlineQueryOptions = '';
    let isInventoryClerk = EnableInventoryClerk(context);
    let userPlant = libCom.getUserDefaultPlant();
    let userStorage = libCom.getUserDefaultStorageLocation();
    let label = isInventoryClerk ? 'offline_stock' : 'offline_vehicle_stock';
    try {
        offlineQueryOptions = context.evaluateTargetPath('#Page:StockListViewPage/#ClientData').OfflineQueryOptions;
    } catch (err) {
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryChecklists.global').getValue(),`StockOfflineHeaderCaption error: ${err}`);
    }
    if (context.searchString && offlineQueryOptions) {
        queryOption = '$expand=Material,MaterialPlant&$filter=' + offlineQueryOptions.substring(0, offlineQueryOptions.indexOf(')')) + `) and (substringof('${context.searchString}', tolower(MaterialNum)) or substringof('${context.searchString}', tolower(Plant)) or substringof('${context.searchString}', tolower(StorageLocation)) or substringof('${context.searchString}', tolower(Material/Description)))`;
    } else if (context.searchString) {
        queryOption = `$expand=Material,MaterialPlant&$filter=(substringof('${context.searchString}', tolower(MaterialNum)) or substringof('${context.searchString}', tolower(Plant)) or substringof('${context.searchString}', tolower(StorageLocation)) or substringof('${context.searchString}', tolower(Material/Description)))`;
    } else if (offlineQueryOptions) {
        queryOption = '$expand=Material,MaterialPlant&$filter=' + offlineQueryOptions;
    } else if (!isInventoryClerk) {
        queryOption = `$expand=Material,MaterialPlant&$filter=Plant eq '${userPlant}' and StorageLocation eq '${userStorage}'`;
    }
    return context.count(
        '/SAPAssetManager/Services/AssetManager.service',
        'MaterialSLocs',
        queryOption).then(count => {
            if (count > 0) {
                return context.localizeText(label) + ' (' + count + ')';
            }
            return context.localizeText(label);
        });
}
