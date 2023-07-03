import allowIssue from '../StockTransportOrder/AllowIssueForSTO';
import libCom from '../../Common/Library/CommonLibrary';

export default function GetStorageLocation(context) {
    let sloc = libCom.getStateVariable(context, 'CurrentDocsItemsStorageLocation');
    let type;
    
    if (context.binding) {
        type = context.binding['@odata.type'].substring('#sap_mobile.'.length);

        if (type === 'MaterialDocItem' || type === 'MaterialSLoc' || type === 'InboundDeliveryItem' || type === 'OutboundDeliveryItem') {
            return context.binding.StorageLocation;
        } else if (type === 'PurchaseOrderItem') {
            return context.binding.StorageLoc;
        } else if (type === 'ProductionOrderItem') {
            return '';
        } else if (type === 'StockTransportOrderItem') {
            if (allowIssue(context)) { //Issue so no default
                return '';
            } else {
                return context.binding.StorageLoc; //Receipt, so use item default
            }
        } else if (type === 'ReservationItem' || type === 'ProductionOrderComponent') {
            return context.binding.SupplyStorageLocation;
        } 
    }
    if (sloc) {
        return sloc;
    }
    let defaultValue = libCom.getUserDefaultStorageLocation();
    return defaultValue || '';

}
