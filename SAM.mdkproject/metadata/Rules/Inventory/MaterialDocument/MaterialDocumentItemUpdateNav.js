import libCommon from '../../Common/Library/CommonLibrary';
import personaLibrary from '../../Persona/PersonaLibrary';
import partIssueFromRelatedItemUpdateNav from '../../Parts/Issue/PartIssueFromRelatedItemUpdateNav';
import setMaterialDocumentGoodsReceipt from './SetMaterialDocumentGoodsReceipt';

export default function MaterialDocumentItemUpdateNav(context) {
    libCommon.setOnCreateUpdateFlag(context, 'UPDATE');
    if (personaLibrary.isInventoryClerk(context)) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', context.getBindingObject()['@odata.readLink'], [],'$expand=AssociatedMaterialDoc,SerialNum,PurchaseOrderItem_Nav,StockTransportOrderItem_Nav,ReservationItem_Nav,PurchaseOrderItem_Nav/MaterialPlant_Nav,StockTransportOrderItem_Nav/MaterialPlant_Nav,ReservationItem_Nav/MaterialPlant_Nav,StockTransportOrderItem_Nav/StockTransportOrderHeader_Nav,ReservationItem_Nav/ReservationHeader_Nav').then(results => {
            if (results && results.length > 0) {
                let materialDocumentItem = results.getItem(0);
                context.getPageProxy().setActionBinding(materialDocumentItem);
                return setMaterialDocumentGoodsReceipt(context);
            }
            return true;
        });
    }
    return partIssueFromRelatedItemUpdateNav(context);
}
