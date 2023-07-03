export default function MetersListViewQueryOptions(context) {
    let searchString = context.searchString;

    let qob = context.dataQueryBuilder();

    let titleSearch = 'substringof(\'' + searchString.toLowerCase() + '\', tolower(Device_Nav/Device)) or substringof(\'' + searchString.toLowerCase() + '\', tolower(Device_Nav/DeviceCategory_Nav/Description))';
    let footnoteSearch = 'substringof(\'' + searchString.toLowerCase() + '\', tolower(Device_Nav/RegisterGroup_Nav/Division)) or substringof(\'' + searchString.toLowerCase() + '\', tolower(Device_Nav/RegisterGroup_Nav/Division_Nav/Description))';

    if (context.binding['@odata.type'] === '#sap_mobile.MyWorkOrderHeader') {
        qob.expand('Workorder_Nav/DisconnectActivity_Nav/DisconnectObject_Nav,Device_Nav/DeviceCategory_Nav/Material_Nav,DeviceLocation_Nav/Premise_Nav,Device_Nav/RegisterGroup_Nav/Division_Nav,Device_Nav/Equipment_Nav/ObjectStatus_Nav/SystemStatus_Nav,Device_Nav/GoodsMovement_Nav,DeviceLocation_Nav/FuncLocation_Nav/Address/AddressCommunication,ConnectionObject_Nav/FuncLocation_Nav/Address/AddressCommunication,DeviceLocation_Nav/Premise_Nav,Workorder_Nav/OrderMobileStatus_Nav,Workorder_Nav/OrderISULinks');
        if (!searchString)
            qob.filter('sap.entityexists(Device_Nav)');
        else
            qob.filter('sap.entityexists(Device_Nav) and (' + titleSearch + ' or ' + footnoteSearch + ')');
    } else {
        qob.expand('DeviceCategory_Nav,RegisterGroup_Nav/Division_Nav,Equipment_Nav/ObjectStatus_Nav/SystemStatus_Nav,ConnectionObject_Nav/FuncLocation_Nav/Address');
        if (searchString) {
            // ConnectionObject Devices do not have a property 'Device_Nav'
            if (context.binding['@odata.type'] === '#sap_mobile.ConnectionObject') {
                titleSearch = titleSearch.replaceAll('Device_Nav/', '');
                footnoteSearch = footnoteSearch.replaceAll('Device_Nav/', '');
            }
            qob.filter(`${titleSearch} or ${footnoteSearch}`);
        }
    }
    return qob;
}
