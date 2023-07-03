import libVal from '../../Common/Library/ValidationLibrary';
import libCom from '../../Common/Library/CommonLibrary';
/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function MaterialListPickerQueryOptions(context) {
    let queryPlant = libCom.getStateVariable(context, 'MaterialPlantValue');
    let querySLoc = libCom.getStateVariable(context, 'MaterialSLocValue');
    let searchString = context.searchString;
    let filtersArray = [];
    let isGoodsReceipt = false;

    let objectType = libCom.getStateVariable(context, 'IMObjectType');
    let move = libCom.getStateVariable(context, 'IMMovementType');
    let plant = libCom.getStateVariable(context, 'CurrentDocsItemsPlant');
    let sloc = libCom.getStateVariable(context, 'CurrentDocsItemsStorageLocation');
    let qb = context.dataQueryBuilder();

    if (objectType === 'ADHOC' && move === 'R') {
        isGoodsReceipt = true;
    }
    if (searchString) {
        searchString = context.searchString.toLowerCase();
        filtersArray.push(`substringof('${searchString}', tolower(MaterialNum))`);
        filtersArray.push(`substringof('${searchString}', tolower(Material/Description))`);
        if (!isGoodsReceipt) {
            filtersArray.push(`substringof('${searchString}', tolower(StorageBin))`);
        }
        qb.filter('(' + filtersArray.join(' or ') + ')');
    }
    if (!libVal.evalIsEmpty(context.binding) && !queryPlant) {
        let type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
        if (type === 'MaterialDocItem') {
            queryPlant = context.binding.Plant;
            if (!isGoodsReceipt && !querySLoc) {
                querySLoc = context.binding.StorageLocation;
            }
        }
    }
    if (!queryPlant) {
        if (plant && sloc) {
            queryPlant = plant;
            if (!isGoodsReceipt && !querySLoc) {
                querySLoc = sloc;
            }
        }
    }
    if (!queryPlant) {
        queryPlant = libCom.getUserDefaultPlant();
        if (!querySLoc) {
            querySLoc = libCom.getUserDefaultStorageLocation();
        }
    }
    if (isGoodsReceipt) {
        qb.expand('Material', 'Material/MaterialBatch_Nav');
        qb.orderBy('MaterialNum', 'Plant');
        qb.filter(`Plant eq '${queryPlant}'`);
        return qb;
    }
    qb.expand('Material/MaterialPlants', 'Material/MaterialBatch_Nav');
    qb.orderBy('MaterialNum', 'Plant', 'StorageLocation');
    qb.filter(`Plant eq '${queryPlant}' and StorageLocation eq '${querySLoc}'`);
    return qb;
}
