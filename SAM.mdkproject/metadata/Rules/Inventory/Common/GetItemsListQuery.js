import autoOpenMovementScreen from '../Search/AutoOpenMovementScreen';

/**
 * Common rule to build queries for PO, STO, PRD and RS items
 * @param {*} context PO, STO, PRD or RS objects
 * @returns DataQueryBuilder
 */
export default function GetItemsListQuery(context) {
    let queryBuilder = context.dataQueryBuilder();
    queryBuilder.orderBy('ItemNum');

    let searchString = context.searchString;
    if (searchString) {
        searchString = context.searchString.toLowerCase();
    }

    let type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
    if (type === 'PurchaseOrderHeader') {
        return getPurchaseOrderItemsQuery(context, queryBuilder, searchString);
    } else if (type === 'StockTransportOrderHeader') {
        return getSTOItemsQuery(context, queryBuilder, searchString);
    } else if (type === 'ReservationHeader') {
        return getReservationItemsQuery(context, queryBuilder, searchString);
    } else if (type === 'ProductionOrderHeader') {
        return getPRDItemsQuery(context, queryBuilder, searchString);
    }
}

function getPurchaseOrderItemsQuery(context, queryBuilder, searchString) {
    queryBuilder.filter("(PurchaseOrderId eq '" + context.binding.PurchaseOrderId + "')");
    queryBuilder.expand('MaterialPlant_Nav','ScheduleLine_Nav', 'PurchaseOrderHeader_Nav', 'POSerialNumber_Nav', 'MaterialDocItem_Nav/PurchaseOrderItem_Nav', 'MaterialDocItem_Nav/SerialNum');
    if (searchString) {
        let searchStringFilters = [
            `substringof('${searchString}', tolower(PurchaseOrderHeader_Nav/SupplyingPlant))`,
            `substringof('${searchString}', tolower(PurchaseOrderHeader_Nav/Vendor_Nav/Name1))`,
            `substringof('${searchString}', tolower(MaterialNum))`,
            `substringof('${searchString}', tolower(StorageLoc))`,
            `substringof('${searchString}', tolower(Plant))`,
            `substringof('${searchString}', tolower(StockType))`,
            `substringof('${searchString}', tolower(ItemNum))`,
            `ScheduleLine_Nav/any(wp : substringof('${searchString}', tolower(wp/Batch)) and (wp/ScheduleLine eq '0001'))`,
            `MaterialPlant_Nav/MaterialSLocs/any(wp : substringof('${searchString}', tolower(wp/StorageBin)) and (wp/StorageLocation eq StorageLoc))`,
            `substringof('${searchString}', tolower(Material_Nav/Description))`,
        ];
        queryBuilder.filter('(' + searchStringFilters.join(' or ') + ')');
    }
    return autoOpenMovementScreen(context, 'PurchaseOrderItems', queryBuilder, searchString);
}

function getSTOItemsQuery(context, queryBuilder, searchString) {
    queryBuilder.filter("(StockTransportOrderId eq '" + context.binding.StockTransportOrderId + "')");
    queryBuilder.expand('MaterialPlant_Nav','StockTransportOrderHeader_Nav','STOScheduleLine_Nav','STOSerialNumber_Nav', 'MaterialDocItem_Nav/SerialNum', 'MaterialDocItem_Nav/StockTransportOrderItem_Nav');
    if (searchString) {
        let searchStringFilters = [
            `substringof('${searchString}', tolower(ItemText))`,
            `substringof('${searchString}', tolower(ItemNum))`,
            `substringof('${searchString}', tolower(MaterialNum))`,
            `substringof('${searchString}', tolower(Plant))`,
            `substringof('${searchString}', tolower(StockType))`,
            `substringof('${searchString}', tolower(StorageLoc))`,
            `STOScheduleLine_Nav/any(wp : substringof('${searchString}', tolower(wp/Batch)) and (wp/ScheduleLine eq '0001'))`,
            `MaterialPlant_Nav/MaterialSLocs/any(wp : substringof('${searchString}', tolower(wp/StorageBin)) and (wp/StorageLocation eq StorageLoc))`,
            `substringof('${searchString}', tolower(Material_Nav/Description))`,
        ];
        queryBuilder.filter('(' + searchStringFilters.join(' or ') + ')');
    }
    return autoOpenMovementScreen(context, 'StockTransportOrderItems', queryBuilder, searchString);
}

function getReservationItemsQuery(context, queryBuilder, searchString) {
    queryBuilder.filter("(ReservationNum eq '" + context.binding.ReservationNum + "')");
    queryBuilder.expand('MaterialPlant_Nav/Material','ReservationHeader_Nav', 'MaterialDocItem_Nav');
    if (searchString) {
        let searchStringFilters = [
            `substringof('${searchString}', tolower(ItemNum))`,
            `substringof('${searchString}', tolower(MaterialNum))`,
            `substringof('${searchString}', tolower(Batch))`,
            `substringof('${searchString}', tolower(StorageBin))`,
            `substringof('${searchString}', tolower(SupplyPlant))`,
            `substringof('${searchString}', tolower(SupplyStorageLocation))`,
            `substringof('${searchString}', tolower(RecordType))`,
            `substringof('${searchString}', tolower(MaterialPlant_Nav/Material/Description))`,
        ];
        queryBuilder.filter('(' + searchStringFilters.join(' or ') + ')');
    }
    return autoOpenMovementScreen(context, 'ReservationItems', queryBuilder, searchString);
}

function getPRDItemsQuery(context, queryBuilder, searchString) {
    queryBuilder.filter("(OrderId eq '" + context.binding.OrderId + "')");
    queryBuilder.expand('Material_Nav','ProductionOrderSerial_Nav', 'ProductionOrderHeader_Nav', 'MaterialPlant_Nav', 'MaterialDocItem_Nav');
    if (searchString) {
        let searchStringFilters = [
            `substringof('${searchString}', tolower(OrderId))`,
            `substringof('${searchString}', tolower(ItemNum))`,
            `substringof('${searchString}', tolower(MaterialNum))`,
            `substringof('${searchString}', tolower(Material_Nav/Description))`,
        ];
        queryBuilder.filter('(' + searchStringFilters.join(' or ') + ')');
    }
    return autoOpenMovementScreen(context, 'ProductionOrderItems', queryBuilder, searchString);
}
