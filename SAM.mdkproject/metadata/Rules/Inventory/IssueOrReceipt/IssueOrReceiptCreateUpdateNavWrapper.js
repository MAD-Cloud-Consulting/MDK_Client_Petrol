import libCom from '../../Common/Library/CommonLibrary';
import isEnabled from '../Validation/IssueOrReceiptIsAllowed';

export default function IssueOrReceiptCreateUpdateNavWrapper(context) {

    if (isEnabled(context)) {

        let parent = libCom.getStateVariable(context, 'IMObjectType');
        let movType = libCom.getStateVariable(context, 'IMMovementType');
        //Figure out binding properties
        libCom.setStateVariable(context, 'Temp_MaterialDocumentReadLink','');
        libCom.setStateVariable(context, 'Temp_MaterialDocumentNumber','');
        libCom.removeStateVariable(context, 'ReceiveAllItemId');

        var actionBinding = context.getPageProxy().getActionBinding();

        let type = actionBinding['@odata.type'].substring('#sap_mobile.'.length);
        var target;
        var targetField;
        var query = '';

        if (type === 'MaterialDocItem') {
            if (parent === 'REV') {
                query = `$filter=MatDocItem eq '${actionBinding.MatDocItem}' and MaterialDocNumber eq '${actionBinding.AssociatedMaterialDoc.MaterialDocNumber}' and MaterialDocYear eq '${actionBinding.AssociatedMaterialDoc.MaterialDocYear}'&$expand=AssociatedMaterialDoc&$top=1`;
            } else {
                query = `$filter=sap.islocal() and MatDocItem eq '${actionBinding.MatDocItem}' and MaterialDocNumber eq '${actionBinding.AssociatedMaterialDoc.MaterialDocNumber}' and MaterialDocYear eq '${actionBinding.AssociatedMaterialDoc.MaterialDocYear}'&$expand=AssociatedMaterialDoc&$top=1`;
            }
        } else { //Item
            if (parent === 'PO') {
                target = actionBinding.PurchaseOrderId;
                targetField = 'PurchaseOrderNumber';
            } else if (parent === 'STO') {
                target = actionBinding.StockTransportOrderId;
                targetField = 'PurchaseOrderNumber';
            } else if (parent === 'RES') {
                target = actionBinding.ReservationNum;
                targetField = 'ReservationNumber';
            } else if (parent === 'PRD') {
                if (movType === 'I') {
                    target = actionBinding.OrderId;
                    targetField = 'ProductionOrderComponent_Nav/OrderId';
                } else if (movType === 'R') {
                    target = actionBinding.OrderId;
                    targetField = 'ProductionOrderItem_Nav/OrderId';
                }
            }
            query = '$filter=sap.islocal() and ' + targetField + " eq '" + target + "'&$expand=AssociatedMaterialDoc&$top=1";
        }

        actionBinding.TempHeader_DocumentDate = '';
        actionBinding.TempHeader_HeaderText = '';
        actionBinding.TempHeader_DeliveryNote = '';
    
        //Check to see if there is a local material document item tied to parent
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'MaterialDocItems', ['MaterialDocNumber'], query).then(function(results) {
            if (results && results.length > 0) {
                let row = results.getItem(0);
                if (row.hasOwnProperty('@sap.isLocal')) {
                    libCom.setStateVariable(context, 'Temp_MaterialDocumentReadLink',row.AssociatedMaterialDoc['@odata.readLink']);
                    libCom.setStateVariable(context, 'Temp_MaterialDocumentNumber',row.MaterialDocNumber);
                    actionBinding.TempHeader_DocumentDate = row.AssociatedMaterialDoc.DocumentDate;
                    actionBinding.TempHeader_HeaderText = row.AssociatedMaterialDoc.HeaderText;
                    actionBinding.TempHeader_DeliveryNote = row.AssociatedMaterialDoc.RefDocumentNumber;
                    return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/IssueOrReceiptCreateUpdateNav.action');
                }
            }
            //Create a new material document for this PO/STO/RES/PRD/MAT
            return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/IssueOrReceiptCreateChangeset.action');
        });
    }
    if (libCom.getStateVariable(context, 'StockTransportOrderExplainMsg')) { //Display STO must be issued before received error
        libCom.removeStateVariable(context, 'StockTransportOrderExplainMsg');
        return context.executeAction('/SAPAssetManager/Actions/Inventory/StockTransportOrder/StockTransportOrderExplainMsg.action');
    }
}
