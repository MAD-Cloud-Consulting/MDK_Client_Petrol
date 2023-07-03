import libCom from '../../Common/Library/CommonLibrary';

export default function PhysicalInventoryItemCreateFromDetailsNavWrapper(context) {

    let binding = context.binding; //PI Header

    libCom.setOnCreateUpdateFlag(context, 'CREATE');
    libCom.setStateVariable(context, 'PhysicalInventoryReturnToList', false);
    libCom.setStateVariable(context, 'PhysicalInventoryLocalId', binding.PhysInvDoc);
    libCom.setStateVariable(context, 'PhysicalInventoryLocalFiscalYear', binding.FiscalYear);
    libCom.setStateVariable(context, 'NewSerialMap', new Map());
    libCom.removeStateVariable(context, 'OldSerialRows');
    libCom.setStateVariable(context, 'PhysicalInventoryItemPlant', binding.Plant);
    libCom.setStateVariable(context, 'PhysicalInventoryItemStorageLocation', binding.StorLocation);

    //Get stock type to use for new line from an existing line on this document
    return context.read('/SAPAssetManager/Services/AssetManager.service', binding['@odata.readLink'] + '/PhysicalInventoryDocItem_Nav', ['StockType'], '$top=1').then(function(result) {
        if (result && result.length > 0) {
            let item = result.getItem(0);
            libCom.setStateVariable(context, 'PhysicalInventoryItemStockType', item.StockType);
            return context.executeAction('/SAPAssetManager/Actions/Inventory/PhysicalInventory/PhysicalInventoryItemCreateNav.action');
        }
        return false; //Failed to read stock type line
    });
}
