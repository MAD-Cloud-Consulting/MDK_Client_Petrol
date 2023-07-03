import libMeter from '../Meter/Common/MeterLibrary';

export default function MeterUpdateNav(context) {
    if (context.binding.ISUProcess.substr(-5) !== '_EDIT') {
        libMeter.setMeterTransactionType(context, context.binding.ISUProcess + '_EDIT');
    }
    return context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'], [],'$expand=Device_Nav/DeviceCategory_Nav/Material_Nav,DeviceLocation_Nav/Premise_Nav,Device_Nav/RegisterGroup_Nav/Division_Nav,Device_Nav/Equipment_Nav/ObjectStatus_Nav/SystemStatus_Nav,Device_Nav/GoodsMovement_Nav,DeviceLocation_Nav/FuncLocation_Nav/Address/AddressCommunication,ConnectionObject_Nav/FuncLocation_Nav/Address/AddressCommunication,DeviceLocation_Nav/Premise_Nav,Workorder_Nav/OrderISULinks,Workorder_Nav/OrderMobileStatus_Nav').then(function(orderISULink) {
        if (orderISULink.getItem(0)) {
            context.setActionBinding(orderISULink.getItem(0));
        }
    }).catch(() => {
        let readlink = "OrderISULinks(DisconnectionNum='" + context.binding.DisconnectionNum + "',DeviceLocation='" + context.binding.DeviceLocation + "',DeviceCategory='" + context.binding.DeviceCategory + "',ConnectionObject='" + context.binding.ConnectionObject + "',EquipmentNum='" + context.binding.EquipmentNum + "',SerialNum='" + context.binding.SerialNum + "',Premise='" + context.binding.Premise + "',OrderNum='" + context.binding.OrderNum + "',Installation='" + context.binding.Installation + "',ISUProcess='" + context.binding.ISUProcess + "',FunctionalLoc='" + context.binding.FunctionalLoc + "')";
        return context.read('/SAPAssetManager/Services/AssetManager.service', readlink, [],'$expand=Device_Nav/DeviceCategory_Nav/Material_Nav,DeviceLocation_Nav/Premise_Nav,Device_Nav/RegisterGroup_Nav/Division_Nav,Device_Nav/Equipment_Nav/ObjectStatus_Nav/SystemStatus_Nav,Device_Nav/GoodsMovement_Nav,DeviceLocation_Nav/FuncLocation_Nav/Address/AddressCommunication,ConnectionObject_Nav/FuncLocation_Nav/Address/AddressCommunication,DeviceLocation_Nav/Premise_Nav,Workorder_Nav/OrderISULinks,Workorder_Nav/OrderMobileStatus_Nav').then(function(orderISULink) {
            if (orderISULink.getItem(0)) {
                context.setActionBinding(orderISULink.getItem(0));
            }
        });
    }).finally(() => {
        return context.executeAction('/SAPAssetManager/Actions/Meters/CreateUpdate/MeterCreateUpdateNav.action');
    });
}
