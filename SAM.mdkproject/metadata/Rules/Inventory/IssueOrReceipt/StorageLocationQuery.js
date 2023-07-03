import allowIssue from '../StockTransportOrder/AllowIssueForSTO';
import libCommon from '../../Common/Library/CommonLibrary';

export default function StorageLocationQuery(context) {
    let plantVar = libCommon.getStateVariable(context, 'CurrentDocsItemsPlant');

    if (context.binding) {
        let plant;

        let binding = context.binding;
        let type = binding['@odata.type'].substring('#sap_mobile.'.length);

        if (type === 'MaterialDocItem' || type === 'InboundDeliveryItem' || type === 'OutboundDeliveryItem') {
            plant = binding.Plant;
        } else if (type === 'PurchaseOrderItem' || type === 'MaterialSLoc') {
            plant = binding.Plant;
        } else if (type === 'StockTransportOrderItem') {
            if (allowIssue(context)) { //Issue so use supply plant
                plant = binding.StockTransportOrderHeader_Nav.SupplyingPlant;
            } else {
                plant = binding.Plant;
            }
        } else if (type === 'ReservationItem' || type === 'ProductionOrderComponent') {
            plant = binding.SupplyPlant;
        } else if (type === 'ProductionOrderItem') {
            plant = binding.PlanningPlant;
        }        
        return "$filter=Plant eq '" + plant + "'&$orderby=StorageLocation";
    }
    if (plantVar) {
        return "$filter=Plant eq '" + plantVar + "'&$orderby=StorageLocation";
    }
    let defaultPlant = libCommon.getUserDefaultPlant();
    if (defaultPlant) {
        return "$filter=Plant eq '" + defaultPlant + "'&$orderby=StorageLocation";
    }
    return '';
}
