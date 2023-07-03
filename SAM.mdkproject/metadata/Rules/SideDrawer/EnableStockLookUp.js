import EnableFieldServiceTechnician from './EnableFieldServiceTechnician';
import EnableMaintenanceTechnician from './EnableMaintenanceTechnician';
import VehicleIsEnabled from '../Vehicle/VehicleIsEnabled';


export default function SideDrawerStockLookUp(context) {
    let isFieldServiceTechnician = EnableFieldServiceTechnician(context);
    let isMaintenanceTechnician = EnableMaintenanceTechnician(context);
    let isVehicleEnabled = VehicleIsEnabled(context);
    return (isMaintenanceTechnician || isFieldServiceTechnician) && isVehicleEnabled;
}
