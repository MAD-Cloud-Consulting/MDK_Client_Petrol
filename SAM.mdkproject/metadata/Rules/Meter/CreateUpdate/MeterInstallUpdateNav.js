import libCommon from '../../Common/Library/CommonLibrary';
import libMeter from '../../Meter/Common/MeterLibrary';

export default function MeterInstallUpdateNav(context) {

    libMeter.setMeterTransactionType(context);

    //set the CHANGSET flag to true
    libCommon.setOnChangesetFlag(context, true);

    let queryOption = '$expand=Device_Nav/RegisterGroup_Nav,' + 
                        'Device_Nav/DeviceCategory_Nav,Device_Nav/Equipment_Nav/ObjectStatus_Nav/SystemStatus_Nav,' + 
                        'DeviceLocation_Nav/FuncLocation_Nav/Address/AddressCommunication,' + 
                        'ConnectionObject_Nav/FuncLocation_Nav/Address/AddressCommunication,ConnectionObject_Nav/DeviceLocations_Nav,' + 
                        'Premise_Nav/Installation_Nav,' + 
                        'DeviceLocation_Nav/Premise_Nav,' + 
                        'Workorder_Nav';

    return libCommon.navigateOnRead(context, '/SAPAssetManager/Actions/Meters/CreateUpdate/MeterCreateUpdateNav.action', context.binding.OrderISULinks[0]['@odata.readLink'], queryOption);
}
