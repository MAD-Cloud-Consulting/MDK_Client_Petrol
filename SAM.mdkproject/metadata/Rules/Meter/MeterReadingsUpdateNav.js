import libMeter from '../Meter/Common/MeterLibrary';

export default function MeterReadingsUpdateNav(context) {
    let binding = context.binding;
    let batchEquipNum = context.binding.EquipmentNum;

    if (binding['@odata.type'] !== '#sap_mobile.OrderISULink') {
        batchEquipNum = String(context.binding.DisconnectActivity_Nav.ActivityNum) + String(context.binding.DisconnectActivity_Nav.DocNum);
        binding = context.binding.DisconnectActivity_Nav.WOHeader_Nav.OrderISULinks[0];
    }
    return context.read('/SAPAssetManager/Services/AssetManager.service', binding['@odata.readLink'], [],'$expand=Device_Nav/DeviceCategory_Nav/Material_Nav,DeviceLocation_Nav/Premise_Nav,Device_Nav/RegisterGroup_Nav/Division_Nav,Device_Nav/Equipment_Nav/ObjectStatus_Nav/SystemStatus_Nav,Device_Nav/GoodsMovement_Nav,DeviceLocation_Nav/FuncLocation_Nav/Address/AddressCommunication,ConnectionObject_Nav/FuncLocation_Nav/Address/AddressCommunication,DeviceLocation_Nav/Premise_Nav,Workorder_Nav/OrderISULinks,Workorder_Nav/OrderMobileStatus_Nav').then(function(orderISULink) {
        if (orderISULink.getItem(0)) {
            let isulink = orderISULink.getItem(0);
            if (context.binding['@odata.type'] !== '#sap_mobile.OrderISULink') {
                isulink.DisconnectObject_Nav = context.binding;
                isulink.DisconnectActivity_Nav = context.binding.DisconnectActivity_Nav;
                isulink.Device_Nav = context.binding.Device_Nav;
            }
            isulink.BatchEquipmentNum = batchEquipNum;
            if (binding.ISUProcess.startsWith('REP_INST')) {
                for (let i in isulink.Workorder_Nav.OrderISULinks) {
                    if (isulink.Workorder_Nav.OrderISULinks[i].ISUProcess.startsWith('REPLACE')) {
                        isulink.BatchEquipmentNum = isulink.Workorder_Nav.OrderISULinks[i].EquipmentNum;
                        break;
                    }
                }
            }
            if (!(isulink.DeviceLink = isulink.Device_Nav)) {
                isulink.DeviceLink = context.binding.Device_Nav;
            }
            if (libMeter.isLocal(isulink.Device_Nav)) {
                libMeter.setMeterTransactionType(context, isulink.ISUProcess + '_EDIT');
            } else {
                libMeter.setMeterTransactionType(context, isulink.ISUProcess);
            }
            context.setActionBinding(isulink);
            return context.executeAction('/SAPAssetManager/Actions/Meters/MeterReadingNavMultiple.action');
        }
        return context.executeAction('/SAPAssetManager/Actions/Meters/MeterReadingNavMultiple.action');
    }).catch(() => {
        let readlink = "OrderISULinks(DisconnectionNum='" + binding.DisconnectionNum + "',DeviceLocation='" + binding.DeviceLocation + "',DeviceCategory='" + binding.DeviceCategory + "',ConnectionObject='" + binding.ConnectionObject + "',EquipmentNum='" + binding.EquipmentNum + "',SerialNum='" + binding.SerialNum + "',Premise='" + binding.Premise + "',OrderNum='" + binding.OrderNum + "',Installation='" + binding.Installation + "',ISUProcess='" + binding.ISUProcess + "',FunctionalLoc='" + binding.FunctionalLoc + "')";
        return context.read('/SAPAssetManager/Services/AssetManager.service', readlink, [],'$expand=Device_Nav/DeviceCategory_Nav/Material_Nav,DeviceLocation_Nav/Premise_Nav,Device_Nav/RegisterGroup_Nav/Division_Nav,Device_Nav/Equipment_Nav/ObjectStatus_Nav/SystemStatus_Nav,Device_Nav/GoodsMovement_Nav,DeviceLocation_Nav/FuncLocation_Nav/Address/AddressCommunication,ConnectionObject_Nav/FuncLocation_Nav/Address/AddressCommunication,DeviceLocation_Nav/Premise_Nav,Workorder_Nav/OrderISULinks,Workorder_Nav/OrderMobileStatus_Nav').then(function(orderISULink) {
            if (orderISULink.getItem(0)) {
                let isulink = orderISULink.getItem(0);
                isulink.BatchEquipmentNum = context.binding.EquipmentNum;
                isulink.DeviceLink = isulink.Device_Nav;
                if (libMeter.isLocal(isulink.Device_Nav)) {
                    libMeter.setMeterTransactionType(context, isulink.ISUProcess + '_EDIT');
                } else {
                    libMeter.setMeterTransactionType(context, isulink.ISUProcess);
                }
                context.setActionBinding(isulink);
                return context.executeAction('/SAPAssetManager/Actions/Meters/MeterReadingNavMultiple.action');
            }
            return context.executeAction('/SAPAssetManager/Actions/Meters/MeterReadingNavMultiple.action');
        });
    });
}
