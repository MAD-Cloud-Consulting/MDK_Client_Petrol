import libMeter from '../../Meter/Common/MeterLibrary';

export default function MeterReadingSingleRegister(context) {
    let prevReadLink = context.evaluateTargetPath('#Page:-Previous/#Property:@odata.readLink');
    return context.read('/SAPAssetManager/Services/AssetManager.service', prevReadLink, [], '$expand=Device_Nav/DeviceCategory_Nav,Device_Nav/Equipment_Nav').then(function(result) {
        let binding = result.getItem(0);
        binding.BatchEquipmentNum = binding.EquipmentNum;
        binding.DeviceLink = binding.Device_Nav;
        binding.FromSingleRegister = context.binding.RegisterNum || context.binding.Register;

        if (libMeter.getMeterTransactionType(context) === 'PERIODIC') {
            binding.readDate = context.binding.SchedMeterReadingDate;
            context.setActionBinding(binding);
            return context.executeAction('/SAPAssetManager/Actions/Meters/Periodic/MeterReadingNavMultiple.action');
        } else {
            context.setActionBinding(binding);
            let workOrderContextBinding = context.evaluateTargetPathForAPI('#Page:WorkOrderDetailsPage').binding;
            libMeter.setMeterTransactionType(context, workOrderContextBinding.OrderISULinks[0].ISUProcess);
            return context.executeAction('/SAPAssetManager/Actions/Meters/MeterReadingNavMultiple.action');
        }
    });
}
