import libCommon from '../../Common/Library/CommonLibrary';
import libMeter from '../../Meter/Common/MeterLibrary';
import ExecuteActionWithAutoSync from '../../ApplicationEvents/AutoSync/ExecuteActionWithAutoSync';

export default function meterReplaceInstallUpdateNav(context) {
    let batchEquipmentNum = context.binding.BatchEquipmentNum;
    let OrderISULink = context.binding;

    //set the CHANGSET flag to true
    libCommon.setOnChangesetFlag(context, true);

    return context.read('/SAPAssetManager/Services/AssetManager.service', OrderISULink['@odata.readLink'], [],'$expand=Device_Nav/RegisterGroup_Nav,Device_Nav/DeviceCategory_Nav,Device_Nav/Equipment_Nav/ObjectStatus_Nav/SystemStatus_Nav,DeviceLocation_Nav/FuncLocation_Nav/Address/AddressCommunication,ConnectionObject_Nav/FuncLocation_Nav/Address/AddressCommunication,Workorder_Nav/OrderISULinks,Workorder_Nav/OrderMobileStatus_Nav').then(function(readOrder) {
        if (readOrder.getItem(0)) {
            let order = readOrder.getItem(0);
            order.BatchEquipmentNum = batchEquipmentNum;
            order.OrderISULink = OrderISULink;
            context.setActionBinding(order);
            libMeter.setMeterTransactionType(context, 'REP_INST');
            return context.executeAction('/SAPAssetManager/Actions/Meters/CreateUpdate/MeterCreateUpdateNav.action');
        }
        return ExecuteActionWithAutoSync(context, '/SAPAssetManager/Actions/Meters/CreateUpdate/MeterReadingsCreateUpdateChangeSetSuccess.action').then( ()=> {
            libCommon.setStateVariable(context, 'METERREADINGOBJ', '');
        });
    });

}
