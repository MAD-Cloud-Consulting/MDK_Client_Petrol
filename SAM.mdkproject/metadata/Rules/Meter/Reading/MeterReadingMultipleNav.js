export default function MeterReadingMultipleNav(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'], [], '$expand=Device_Nav/DeviceCategory_Nav,Device_Nav/Equipment_Nav').then(function(result) {
        let binding = result.getItem(0);
        binding.ErrorObject = context.binding.ErrorObject;
        binding.BatchEquipmentNum = context.binding.EquipmentNum;
        binding.DeviceLink = binding.Device_Nav;
        binding.FromSingleRegister = context.binding.Register;

        for (let idx = 0; idx < context.binding.pageBinding.ErrorObject.CustomHeaders.length; idx ++) {
            let obj = context.binding.pageBinding.ErrorObject.CustomHeaders[idx];
            if (obj.Name === 'OfflineOData.TransactionID') {
                binding.BatchEquipmentNum = obj.Value;
            }
        }

        context.setActionBinding(binding);

        return context.executeAction('/SAPAssetManager/Actions/Meters/MeterReadingNavMultiple.action');
    });
}
