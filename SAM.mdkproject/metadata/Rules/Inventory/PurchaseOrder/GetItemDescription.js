import libCom from '../../Common/Library/CommonLibrary';

export default function GetItemDescription(context) {
    const binding = context.binding;
    const type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
    let date = '';

    if (type === 'PurchaseOrderItem') {
        date =  binding.ScheduleLine_Nav[0] && binding.ScheduleLine_Nav[0].DeliveryDate;
    } else if (type === 'StockTransportOrderItem') {
        date = binding.STOScheduleLine_Nav[0] && binding.STOScheduleLine_Nav[0].DeliveryDate;
    } else if (type === 'ReservationItem' || type === 'ProductionOrderComponent') {
        date = binding.RequirementDate;
    } else if (type === 'ProductionOrderItem') {
        date = binding.ProductionOrderHeader_Nav.BasicStartDate;
    }

    if (date) {
        const dateString = libCom.dateStringToUTCDatetime(date);
        const dateText = libCom.getFormattedDate(dateString, context);
        return dateText;
    }

    return date;
}
