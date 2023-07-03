export default function MeterCreateUpdateNav(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'], [], '$expand=Device_Nav/RegisterGroup_Nav,Device_Nav/DeviceCategory_Nav,Device_Nav/Equipment_Nav/ObjectStatus_Nav/SystemStatus_Nav,DeviceLocation_Nav/FuncLocation_Nav/Address/AddressCommunication,ConnectionObject_Nav/FuncLocation_Nav/Address/AddressCommunication,Workorder_Nav').then(function(result) {
        context.setActionBinding(result.getItem(0));
        return context.executeAction('/SAPAssetManager/Actions/Meters/CreateUpdate/MeterCreateUpdateNav.action');
    });
}
