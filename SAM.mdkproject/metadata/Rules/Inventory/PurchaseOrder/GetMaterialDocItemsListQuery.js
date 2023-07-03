import Logger from '../../Log/Logger';
import comLib from '../../Common/Library/CommonLibrary';
/**
* This function returns the material document items which are related to a PO/STO/RES
*/

export default function GetMaterialDocItemsListQuery(clientAPI, isReversal = false, orderByPostingDate = true) {
    let type = clientAPI.binding['@odata.type'].substring('#sap_mobile.'.length);
    //initialize to return zero results because 1 is not equal to 2
    let matDocItemsQueryOptions = '$filter=1 eq 2';
    if (type === 'PurchaseOrderHeader' || type === 'PurchaseOrderItem') {
        matDocItemsQueryOptions = "$filter=PurchaseOrderNumber eq '" + clientAPI.binding.PurchaseOrderId + "'";
    } else if (type === 'StockTransportOrderHeader' || type === 'StockTransportOrderItem') {
        matDocItemsQueryOptions = "$filter=PurchaseOrderNumber eq '" + clientAPI.binding.StockTransportOrderId + "'";
    } else if (type === 'ProductionOrderHeader' || type === 'ProductionOrderItem' || type === 'ProductionOrderComponent') {
        matDocItemsQueryOptions = "$filter=ProductionOrderComponent_Nav/OrderId eq '" + clientAPI.binding.OrderId + "' or ProductionOrderItem_Nav/OrderId eq '" + clientAPI.binding.OrderId + "'";
    } else if (type === 'ReservationHeader' || type === 'ReservationItem') {
        matDocItemsQueryOptions = "$filter=ReservationNumber eq '" + clientAPI.binding.ReservationNum + "'";
    } else if (type === 'MaterialDocument' || type === 'MaterialDocItem') {
        if (isReversal) {
            matDocItemsQueryOptions = "$filter=ReferenceDocHdr eq '" + clientAPI.binding.MaterialDocNumber + "'";
        } else {
            matDocItemsQueryOptions = "$filter=MaterialDocNumber eq '" + clientAPI.binding.MaterialDocNumber + "'";
        }
    } 

    return clientAPI.read('/SAPAssetManager/Services/AssetManager.service', 'MaterialDocItems', ['MaterialDocNumber'], matDocItemsQueryOptions).then((result) => {
        const page = clientAPI.evaluateTargetPath('#Page:' + comLib.getPageName(clientAPI));
        //Initialize MaterialDocItems total count to zero. It’ll be used in MaterialDocumentListCaption.js if result from above query is greater than zero.
        page.context.clientData['MaterialDocItems.total'] = 0;
        if (result && result.length > 0) {
            page.context.clientData['MaterialDocItems.total'] = result.length; //Save MaterialDocItems total count to be used in MaterialDocumentListCaption.js.
            let matDocNmbrs = [];
            for (var i = 0; i < result.length; ++i) {
                matDocNmbrs.push(result.getItem(i).MaterialDocNumber);  
            }
            let uniqueNmbrs = new Set(matDocNmbrs); //De-duplicate the list
            matDocNmbrs.length = 0; //clear the orignal array so we can reuse it.
            uniqueNmbrs.forEach((materialDocumentNum) => {
                matDocNmbrs.push('MaterialDocNumber eq \'' + materialDocumentNum + '\'');
            });
            let qb = clientAPI.dataQueryBuilder();
            qb.expand('AssociatedMaterialDoc', 'Reservation_Nav', 'ReservationItem_Nav', 'PurchaseOrder_Nav', 'PurchaseOrderItem_Nav', 'STO_Nav', 'StockTransportOrderItem_Nav', 'SerialNum', 'ProductionOrderItem_Nav', 'ProductionOrderComponent_Nav');
            qb.filter('(' + matDocNmbrs.join(' or ') + ')');
            let searchString = clientAPI.searchString;
            if (searchString) {
                searchString = searchString.toLowerCase();
                let searchStrFilters = [
                    `substringof('${searchString}', tolower(MaterialDocNumber))`,
                    `substringof('${searchString}', tolower(MatDocItem))`,
                    `substringof('${searchString}', tolower(Material))`,
                    `substringof('${searchString}', tolower(Plant))`,
                    `substringof('${searchString}', tolower(StorageLocation))`,
                    `substringof('${searchString}', tolower(StorageBin))`,
                    `substringof('${searchString}', tolower(Batch))`,
                ];
                qb.filter('(' + searchStrFilters.join(' or ') + ')');
            }
            qb.orderBy(orderByPostingDate ? 'AssociatedMaterialDoc/PostingDate desc, MaterialDocNumber desc, MatDocItem' : 'MaterialDocNumber, MatDocItem');
            
            return qb;
        } else {
            //Have the query return zero results because 1 is not equal to 2
            return '$filter=1 eq 2';
        }
	}).catch((error) => {
		Logger.error(clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Logs/Inventory/CategoryMaterialDocItems.global').getValue(),`GetMaterialDocItemsListQuery(clientAPI) error: ${error}`);
		return '$filter=1 eq 2';
    });
}
