import libCommon from '../../Common/Library/CommonLibrary';
import libEval from '../../Common/Library/ValidationLibrary';
export default function MeterOnValueChange(context) {
    let formCellContainer = context.getPageProxy().getControl('FormCellContainer');

    // get the Manufacturer, Register Group, and Device
    let manufacturerControl = formCellContainer.getControl('ManufacturerProp');
    let registerGroupControl = formCellContainer.getControl('RegisterGroupProp');
    let deviceControl = formCellContainer.getControl('DeviceProp');
    let devisionControl = formCellContainer.getControl('DivisionProp');
    let meterReturnValue = libCommon.getListPickerValue(context.getValue());
    let movementTypeLstPkr = formCellContainer.getControl('MovementTypeLstPkr');
    let receivingPlantLstPkr = formCellContainer.getControl('ReceivingPlantLstPkr');

    if (meterReturnValue) {

        return context.read('/SAPAssetManager/Services/AssetManager.service', `Devices('${meterReturnValue}')`, [], '$expand=Equipment_Nav,DeviceCategory_Nav/Material_Nav,RegisterGroup_Nav/Division_Nav,Equipment_Nav/ObjectStatus_Nav/SystemStatus_Nav').then(result => {
            if (result && result.getItem(0)) {
                let myDevice = result.getItem(0);
                context.getPageProxy().getClientData().DeviceReadLink = myDevice['@odata.readLink'];
                context.getPageProxy().getClientData().DeviceCategory = myDevice.DeviceCategory;
                context.getPageProxy().getClientData().Division = myDevice.RegisterGroup_Nav.Division;
                context.getPageProxy().getClientData().Device = myDevice.Device;

                let manuFacturerNewValue = myDevice.Equipment_Nav.Manufacturer;
                let registerGroupNewValue = myDevice.RegisterGroup; //TODO, wait for backend to have RegisterGroup implemented
                let deviceNewValue = libEval.evalIsEmpty(myDevice.DeviceCategory_Nav.Material_Nav) ? myDevice.Equipment_Nav.EquipDesc : myDevice.DeviceCategory_Nav.Material_Nav.Description;
                let devisionNewValue = myDevice.RegisterGroup_Nav.Division_Nav.Division + ' - ' + myDevice.RegisterGroup_Nav.Division_Nav.Description;

                manufacturerControl.setVisible(true);
                registerGroupControl.setVisible(true);
                deviceControl.setVisible(true);
                movementTypeLstPkr.setVisible(true);
                receivingPlantLstPkr.setVisible(true);
                if (myDevice.Equipment_Nav.ObjectStatus_Nav.SystemStatus_Nav.SystemStatus === 'I0099') {
                    movementTypeLstPkr.setVisible(false);
                    receivingPlantLstPkr.setVisible(false);
                }
                manufacturerControl.setValue(manuFacturerNewValue);
                registerGroupControl.setValue(registerGroupNewValue);
                deviceControl.setValue(deviceNewValue);
                devisionControl.setValue(devisionNewValue);
            }
            return true;
        });
    } else {
        manufacturerControl.setVisible(false);
        registerGroupControl.setVisible(false);
        deviceControl.setVisible(false);
        return true;
    }
}
