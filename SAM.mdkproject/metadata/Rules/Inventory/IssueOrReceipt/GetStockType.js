import libCom from '../../Common/Library/CommonLibrary';

export default function GetStockType(context) {

    let stock = '';
    let type;
    let objectType = libCom.getStateVariable(context, 'IMObjectType');
    
    if (context.binding) { 
        type = context.binding['@odata.type'].substring('#sap_mobile.'.length);

        if (type === 'MaterialDocItem') {
            stock = context.binding.StockType;
        } else if (type === 'PurchaseOrderItem' || type === 'StockTransportOrderItem') {
            stock = context.binding.StockType;
        } else if (type === 'ReservationItem') {
            stock = ''; //No stock type for reservations
        }

        if (!stock) {
            stock = 'UNRESTRICTED'; //Need to set a temp value, because unrestricted in database is '' and MDK seems to require a real value
        }
    }
    if (!stock && objectType === 'ADHOC') {
        stock = 'UNRESTRICTED';
    }
    return stock; //Default to empty (unrestricted stock)
}
