export default function ActivityQueryOptsFix(context) {
    if (context.binding['@odata.type'] === '#sap_mobile.OrderISULink') {
        return '$expand=Workorder_Nav/DisconnectActivity_Nav/DisconnectObject_Nav,Installation_Nav,Premise_Nav,Device_Nav/DeviceCategory_Nav/Material_Nav,Device_Nav/RegisterGroup_Nav/Division_Nav,Device_Nav/Equipment_Nav/ObjectStatus_Nav/SystemStatus_Nav,Device_Nav/GoodsMovement_Nav,DeviceLocation_Nav/FuncLocation_Nav/Address/AddressCommunication,ConnectionObject_Nav/FuncLocation_Nav/Address/AddressCommunication,DeviceLocation_Nav/Premise_Nav,Workorder_Nav/OrderMobileStatus_Nav,Workorder_Nav/OrderISULinks';
    } else if (context.binding['@odata.type'] === '#sap_mobile.DisconnectionObject') {
        return '$expand=Workorder_Nav/DisconnectActivity_Nav/DisconnectObject_Nav,Installation_Nav,Premise_Nav,DeviceLocation_Nav/FuncLocation_Nav/Address/AddressCommunication,ConnectionObject_Nav/FuncLocation_Nav/Address/AddressCommunication,DeviceLocation_Nav/Premise_Nav,Workorder_Nav/OrderMobileStatus_Nav,Workorder_Nav/OrderISULinks,Device_Nav';
    } else {
        return '$expand=Equipment_Nav';
    }
}
