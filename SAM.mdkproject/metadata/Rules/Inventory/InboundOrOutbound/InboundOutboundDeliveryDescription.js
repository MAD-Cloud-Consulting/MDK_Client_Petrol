import libCom from '../../Common/Library/CommonLibrary';

export default function InboundOutboundDeliveryDescription(context) {
    const binding = context.binding;
    let date = '';

    if (binding.OutboundDelivery_Nav) {
        date = binding.OutboundDelivery_Nav.DeliveryDate;
    } else if (binding.InboundDelivery_Nav) {
        date = binding.InboundDelivery_Nav.DeliveryDate;
    }

    if (date) {
        const dateString = libCom.dateStringToUTCDatetime(date);
        const dateText = libCom.getFormattedDate(dateString, context);
        return dateText;
    }

    return date;
}
