import common from '../../Common/Library/CommonLibrary';
import allowIssue from '../StockTransportOrder/AllowIssueForSTO';
/**
 * This function returns the plant object header field on PurchaseOrderItemDetails page
 */
export default function GetPlantName(context) {
    let plantVar = common.getStateVariable(context, 'CurrentDocsItemsPlant');
    let type;
    
    if (context.binding) {
        let binding = context.binding;
        type = binding['@odata.type'].substring('#sap_mobile.'.length);
        let plant = '';

        if (type === 'MaterialDocItem' || type === 'PurchaseOrderItem' || type === 'MaterialSLoc' || type === 'PhysicalInventoryDocItem') {
            plant = binding.Plant;
        } else if (type === 'StockTransportOrderItem') { 
            if (allowIssue(context)) { //Issue so use supply plant
                plant = binding.StockTransportOrderHeader_Nav.SupplyingPlant;
            } else {
                plant = binding.Plant;
            }
        } else if (type === 'ReservationItem' || type === 'ProductionOrderComponent') {
            plant = binding.SupplyPlant;
        } else if (type === 'InboundDeliveryItem' || type === 'OutboundDeliveryItem') {
            plant = binding.Plant;
        } else if (type === 'ProductionOrderItem') {
            plant = binding.PlanningPlant;
        }

        // return common.getPlantName(context, plant);
        return plant;
    }
    if (plantVar) {
        // return common.getPlantName(context, plantVar);
        return plantVar;
    }
    let defaultValue = common.getUserDefaultPlant();
    return defaultValue || '';
}
