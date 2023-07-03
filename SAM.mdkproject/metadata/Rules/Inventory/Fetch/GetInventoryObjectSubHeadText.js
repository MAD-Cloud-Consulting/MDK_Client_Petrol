import libCommon from '../../Common/Library/CommonLibrary';

/**
 * 
 * @param {*} context 
 */
export default function GetInventoryObjectSubHeadText(context) {
    let binding = context.getBindingObject();
    if (binding) {
        switch (binding.IMObject) {
            case 'ST':
                if (binding.SupplyingPlant) {
                    return libCommon.getPlantName(context, binding.SupplyingPlant);
                }
                break;
            case 'PO':
            case 'IB':
                if (binding.Vendor) {
                    return libCommon.getVendorName(context, binding.Vendor);
                }
                break;
            case 'OB':
                if (binding.ReceivingPlant) {
                    return libCommon.getPlantName(context, binding.ReceivingPlant);
                }
                break;
            case 'RS':
                if (binding.OrderId) {
                    return binding.OrderId;
                }
                break;
            case 'PI':
                if (binding.Plant && binding.StorageLocation) {
                    return binding.Plant + ' - ' + binding.StorageLocation;
                }
                break;
        }
    }
    return '';
}
