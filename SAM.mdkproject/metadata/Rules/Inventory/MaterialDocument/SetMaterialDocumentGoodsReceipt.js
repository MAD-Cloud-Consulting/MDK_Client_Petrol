import libCom from '../../Common/Library/CommonLibrary';
import EnableMultipleTechnician from '../../SideDrawer/EnableMultipleTechnician';
import wrapper from '../IssueOrReceipt/IssueOrReceiptCreateUpdateNavWrapper';
import reloadMaterialDocumentItem from '../MaterialDocumentItem/ReloadMaterialDocumentItem';

export default function SetMaterialDocumentGoodsReceipt(context) {

    let binding = context.getPageProxy().getActionBinding() || context.getPageProxy().getClientData().item || context.binding;
    if (EnableMultipleTechnician(context) && libCom.getPreviousPageName(context) === 'MaterialDocumentRecentList') {
        libCom.setStateVariable(context, 'IMObjectType', 'TRF');
        libCom.setStateVariable(context, 'IMMovementType', 'I');
        libCom.setStateVariable(context, 'TempLine_MatDocItemReadLink', binding['@odata.readLink']);
        libCom.setStateVariable(context, 'TempLine_MatDocItem', binding.MatDocItem);
        libCom.setOnCreateUpdateFlag(context, 'UPDATE');
        return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/VehicleIssueOrReceiptCreateChangeset.action');
    }
    if (binding['@sap.isLocal']) { //Only allow editing of local material document items
        let readLink = binding['@odata.readLink'];
        return reloadMaterialDocumentItem(context, readLink).then(function(newItem) {        
            context.getPageProxy().setActionBinding(newItem);  //Rebind the mat doc item we just reloaded to get the latest snapshot
            binding = newItem;

            if (binding.PurchaseOrderItem_Nav) {
                libCom.setStateVariable(context, 'IMObjectType', 'PO');
            } else if (binding.StockTransportOrderItem_Nav) {
                libCom.setStateVariable(context, 'IMObjectType', 'STO');
            } else if (binding.ReservationItem_Nav) {
                libCom.setStateVariable(context, 'IMObjectType', 'RES');
            } else if (binding.ProductionOrderItem_Nav || binding.ProductionOrderComponent_Nav) {
                libCom.setStateVariable(context, 'IMObjectType', 'PRD');
            } else {
                libCom.setStateVariable(context, 'IMObjectType', 'ADHOC');
            }

            if (binding.AssociatedMaterialDoc && binding.AssociatedMaterialDoc.GMCode) {
                let gmCode = binding.AssociatedMaterialDoc.GMCode;

                if (binding.ReferenceDocHdr && (gmCode === '06' || gmCode === '01')) {
                    libCom.setStateVariable(context, 'IMObjectType', 'REV'); 
                    libCom.setStateVariable(context, 'IMMovementType', 'EDIT');
                } else if (gmCode === '03' || gmCode === '04') {
                    libCom.setStateVariable(context, 'IMMovementType', 'I'); //I/R
                    if (gmCode === '04' && !binding.StockTransportOrderItem_Nav) {
                        libCom.setStateVariable(context, 'IMObjectType', 'TRF'); 
                    }
                } else if ((gmCode === '01' || gmCode === '02' || gmCode === '05')) {
                    libCom.setStateVariable(context, 'IMMovementType', 'R'); //I/R
                }
            }
            return wrapper(context);
        });
    } else {
        context.getPageProxy().setActionBinding(binding); 
        libCom.setStateVariable(context, 'IMObjectType', 'REV');
        if (binding.MovementIndicator === 'B' && binding.PurchaseOrderNumber && binding.MovementType === '101' && binding.Vendor) {
            libCom.setStateVariable(context, 'IMMovementType', 'RET');
        } else {
            libCom.setStateVariable(context, 'IMMovementType', 'REV');
        }
        
        return wrapper(context);
    }
}
