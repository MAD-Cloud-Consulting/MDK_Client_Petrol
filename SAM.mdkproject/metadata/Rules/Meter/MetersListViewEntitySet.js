export default function MetersListViewEntitySet(context) {
    if (context.binding['@odata.type'] === '#sap_mobile.MyWorkOrderHeader') {
        return context.binding['@odata.readLink'] + '/OrderISULinks';
    } else {
        return context.binding['@odata.readLink'] + '/Devices_Nav';
    }
}
