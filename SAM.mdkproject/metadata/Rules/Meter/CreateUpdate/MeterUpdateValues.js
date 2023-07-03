import libMeter from '../../Meter/Common/MeterLibrary';

export default function MeterUpdateValues(context) {
    let controlName = context.getName();
    let meterTransactionType = libMeter.getMeterTransactionType(context);

    if (context.evaluateTargetPathForAPI('#Page:-Previous').getClientData().FromErrorArchive || context.evaluateTargetPathForAPI('#Page:-Previous').getClientData().ErrorObject) {
        meterTransactionType = context.binding.ISUProcess + '_EDIT';
    }

    if (meterTransactionType === 'INSTALL' || meterTransactionType === 'REP_INST') {
        return '';
    } else {
        if (controlName === 'ManufacturerProp') {
            return context.getPageProxy().binding.Device_Nav.Equipment_Nav.Manufacturer;
        } else if (controlName === 'RegisterGroupProp') {
            return context.getPageProxy().binding.Device_Nav.RegisterGroup;
        } else if (controlName === 'DeviceProp') {
            return context.getPageProxy().binding.Device_Nav.Device + ' - ' + context.getPageProxy().binding.Device_Nav.DeviceCategory_Nav.Material_Nav.Description;
        } else if (controlName === 'DivisionProp') {
            return context.getPageProxy().binding.Device_Nav.RegisterGroup_Nav.Division_Nav.Division + ' - ' + context.getPageProxy().binding.Device_Nav.RegisterGroup_Nav.Division_Nav.Description;
        }
    } 
    return '';
}
