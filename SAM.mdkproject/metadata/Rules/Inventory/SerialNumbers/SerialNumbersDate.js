import GetItemDescription from '../PurchaseOrder/GetItemDescription';
import InboundOutboundDeliveryDescription from '../InboundOrOutbound/InboundOutboundDeliveryDescription';

export default function SerialNumbersDate(context) {
    const type = context.binding['@odata.type'].substring('#sap_mobile.'.length);

    if (type === 'PurchaseOrderItem' || type === 'StockTransportOrderItem' || type === 'ReservationItem') {
        return GetItemDescription(context);
    }

    if (type === 'InboundDeliveryItem' || type === 'OutboundDeliveryItem') {
        return InboundOutboundDeliveryDescription(context);
    }
}
