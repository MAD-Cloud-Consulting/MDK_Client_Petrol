export default function ActivityFix(context) {
    if (context.binding['@odata.type'] === '#sap_mobile.OrderISULink') {
        return context.binding['@odata.readLink'];
    } else if (context.binding['@odata.type'] === '#sap_mobile.DisconnectionObject') {
        return context.binding['@odata.readLink'] + '/DisconnectActivity_Nav/WOHeader_Nav/OrderISULinks';
    } else {
        return context.binding['@odata.readLink'];
    }
}
