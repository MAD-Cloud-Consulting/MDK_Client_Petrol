import libCom from '../../Common/Library/CommonLibrary';
import ODataDate from '../../Common/Date/ODataDate';
import IssueOrReceiptItemUpdateWrapper from './IssueOrReceiptItemUpdateWrapper';
//import onDemandObjectCreate from '../PurchaseOrder/PurchaseOrderOnDemandObjectDelete';

export default function ReceiptReceiveAllCreatePost(context) {

    let binding = context.binding;
    let type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
    let query;
    let target;

    //Material document header fields (some from screen)
    binding.TempHeader_DocumentDate = new ODataDate(libCom.getControlProxy(context,'DocumentDate').getValue()).toLocalDateString();
    binding.TempHeader_MaterialDocYear = new ODataDate(libCom.getControlProxy(context,'DocumentDate').getValue()).toDBDate(context).getFullYear().toString();
    binding.TempHeader_PostingDate = new ODataDate().toDBDateString(context);
    binding.TempHeader_GMCode = '01'; //Goods receipt for purchase order
    binding.TempHeader_HeaderText = libCom.getControlProxy(context,'HeaderTextSimple').getValue();
    binding.TempHeader_DeliveryNote = libCom.getControlProxy(context,'DeliveryNoteSimple').getValue();
    binding.TempHeader_UserName = libCom.getSapUserName(context);

    if (type === 'PurchaseOrderHeader') {
        let poNumber = binding.PurchaseOrderId;
        query = "$filter=PurchaseOrderId eq '" + poNumber + "' and OpenQuantity gt 0 and DeliveryCompletedFlag ne 'X' and FinalDeliveryFlag ne 'X' and StorageLoc ne ''";
        target = 'PurchaseOrderItems';
    } else if (type === 'StockTransportOrderHeader') {
        let poNumber = binding.StockTransportOrderId;
        query = "$filter=StockTransportOrderId eq '" + poNumber + "' and DeliveryCompletedFlag ne 'X' and FinalDeliveryFlag ne 'X' and StorageLoc ne ''";
        query += ' and (IssuedQuantity gt ReceivedQuantity)'; //We use issue qty instead of open for STO
        target = 'StockTransportOrderItems';
    }

    query += " and MaterialPlant_Nav/BatchIndicator eq '' and MaterialPlant_Nav/SerialNumberProfile eq ''";
    query += '&$orderby=ItemNum';

    //Read all lines that are able to be received
    return context.read('/SAPAssetManager/Services/AssetManager.service', target, [], query).then(function(results) {
        if (results && results.length > 0) {
            var itemArray = [];
            results.forEach(function(row) {
                itemArray.push(row);
            });
            //Create the material document header
            return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/IssueOrReceiptMaterialDocumentCreate.action').then(() => {
                //Create the items in a loop
                return CreateMaterialDocumentItemLoop(context, itemArray, 0).then(() => {
                    libCom.removeStateVariable(context, 'ReceiveAllItemId');
                    //Create or update the on demand object record to refresh the PO from backend
                    //return onDemandObjectCreate(context).then(() => {  
                        //Close screen and show success popup
                        return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/DocumentCreateSuccessWithClose.action');
                    //});
                });
            });
        }
        return false; //Nothing to receive
    });
}

//Loop over PO items and create material document items
export function CreateMaterialDocumentItemLoop(context, items, itemLine) {

    let binding = context.binding;
    let row = items[0];
    let type = row['@odata.type'].substring('#sap_mobile.'.length);

    itemLine++; //Keep track of the line number because of the changeset

    //Line item (fields from screen)
    binding.TempLine_MovementType = '101';
    binding.TempLine_MovementIndicator = 'B'; //Receipt
    binding.TempLine_EntryQuantity = row.OpenQuantity;
    binding.TempLine_Batch = '';
    binding.TempLine_AutoGenerateSerialNumbers = '';
    binding.TempLine_StorageLocation = row.StorageLoc;
    binding.TempLine_SpecialStockInd = '';
    binding.TempLine_StockType = row.StockType;
    binding.TempLine_ItemText = '';
    binding.TempLine_UnloadingPoint = '';

    binding.TempItem_ItemReadLink = row['@odata.readLink'];
    binding.TempLine_OldQuantity = 0;

    binding.TempLine_PurchaseOrderNumber = row.PurchaseOrderId;
    binding.TempLine_PurchaseOrderItem = row.ItemNum;
    binding.TempLine_Material = row.MaterialNum;
    binding.TempLine_EntryUOM = row.OrderUOM;
    binding.TempLine_Plant = row.Plant;
    //Item values to update the PurchaseOrderItem reflecting this receipt
    binding.TempItem_OpenQuantity = row.OpenQuantity;
    binding.TempItem_ReceivedQuantity = row.ReceivedQuantity;

    if (type === 'StockTransportOrderItem') {
        binding.TempLine_PurchaseOrderNumber = row.StockTransportOrderId;
        binding.TempLine_EntryQuantity = Number(row.IssuedQuantity) - Number(row.ReceivedQuantity);
        binding.TempItem_IssuedQuantity = row.IssuedQuantity;
    }

    libCom.setStateVariable(context, 'ReceiveAllItemId', itemLine.toString().padStart(4, '0'));

    //Create the material document item
    return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/IssueOrReceiptMaterialDocumentItemCreate.action').then(() => {
        //Update the PO Item counts
        return IssueOrReceiptItemUpdateWrapper(context).then(() => {  
            //Continue looping
            items.shift(); //Drop the first row in the array
            if (items.length > 0) {
                return CreateMaterialDocumentItemLoop(context, items, itemLine); //Recursively process the next item
            }
            return Promise.resolve(true); //No more items
        });
    });
}
