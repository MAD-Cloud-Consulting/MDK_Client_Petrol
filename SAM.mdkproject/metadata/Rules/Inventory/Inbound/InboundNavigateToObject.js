import comLib from '../../Common/Library/CommonLibrary';
import resetListPageVariables from '../Common/ResetListPageVariables';

/**
 * Navigate to the proper object from the inbound list
 */
export default function InboundNavigateToObject(clientAPI) {
    let pageProxy = clientAPI.getPageProxy();
    let actionContext = pageProxy.getActionBinding();

    if (actionContext.PurchaseOrderHeader_Nav) {
        resetListPageVariables(clientAPI);
        return comLib.navigateOnRead(pageProxy, '/SAPAssetManager/Actions/Inventory/PurchaseOrder/PurchaseOrderDetailsNav.action', actionContext.PurchaseOrderHeader_Nav['@odata.readLink'], '$expand=MyInventoryObject_Nav');
    } else if (actionContext.InboundDelivery_Nav) {
        return comLib.navigateOnRead(pageProxy, '/SAPAssetManager/Actions/Inventory/Inbound/InboundDeliveryDetailNav.action', actionContext.InboundDelivery_Nav['@odata.readLink'], '$expand=MyInventoryObject_Nav');
    } else if (actionContext.StockTransportOrderHeader_Nav) {
        return comLib.navigateOnRead(pageProxy, '/SAPAssetManager/Actions/Inventory/StockTransportOrder/StockTransportOrderDetailsNav.action', actionContext.StockTransportOrderHeader_Nav['@odata.readLink'], '$expand=MyInventoryObject_Nav');
    } else if (actionContext.OutboundDelivery_Nav) {
        return comLib.navigateOnRead(pageProxy, '/SAPAssetManager/Actions/Inventory/OutboundDelivery/OutboundDeliveryDetailNav.action', actionContext.OutboundDelivery_Nav['@odata.readLink'], '$expand=MyInventoryObject_Nav,Customer_Nav');
    } else if (actionContext.ReservationHeader_Nav) {
        return comLib.navigateOnRead(pageProxy, '/SAPAssetManager/Actions/Inventory/Reservation/ReservationDetailsNav.action', actionContext.ReservationHeader_Nav['@odata.readLink'], '$expand=MyInventoryObject_Nav');		
    } else if (actionContext.PhysicalInventoryDocHeader_Nav) {
        return comLib.navigateOnRead(pageProxy, '/SAPAssetManager/Actions/Inventory/PhysicalInventory/PhysicalInventoryDetailsNav.action', actionContext.PhysicalInventoryDocHeader_Nav['@odata.readLink'], '');
    } else if (actionContext.ProductionOrderHeader_Nav) {
        return comLib.navigateOnRead(pageProxy, '/SAPAssetManager/Actions/Inventory/ProductionOrder/ProductionOrderDetailsNav.action', actionContext.ProductionOrderHeader_Nav['@odata.readLink'], '$expand=ProductionOrderItem_Nav/Material_Nav');
    } else if (actionContext.MaterialDocument_Nav) {
        return comLib.navigateOnRead(pageProxy, '/SAPAssetManager/Actions/Inventory/MaterialDocument/MaterialDocumentDetailsIMNav.action', actionContext.MaterialDocument_Nav['@odata.readLink'], '$expand=RelatedItem');
    }

}
