import libCom from '../../Common/Library/CommonLibrary';
import VehicleIsEnabled from '../../Vehicle/VehicleIsEnabled';
export default function PartCreateDefaultStorageLocation(context) {
    const vehicleIsEnabled = VehicleIsEnabled(context);
    const pageName = libCom.getPageName(context);

    if (vehicleIsEnabled && pageName === 'VehiclePartCreate') {
        return libCom.getUserDefaultStorageLocation();
    } 
    return context.binding.StorageLocation;
}
