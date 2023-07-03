export default function DisconnectionTypeIsVisible(context) {
    let binding = context.getPageProxy().binding;
    if (binding['@odata.type'] === '#sap_mobile.MyWorkOrderHeader') {
        return context.getPageProxy().binding.OrderISULinks[0].ISUProcess === 'DISCONNECT';
    } else {
        return context.getPageProxy().binding.DisconnectActivity_Nav.WOHeader_Nav.OrderISULinks[0].ISUProcess === 'DISCONNECT';
    }
}
