import enableFieldServiceTechnician from './EnableFieldServiceTechnician';
import enableMaintenanceTechnician from './EnableMaintenanceTechnician';
/**
* Check if persona assignment is maintenance or field technician
* @param {IClientAPI} context
*/
export default function EnableMultipleTechnician(context) {
    return enableFieldServiceTechnician(context) || enableMaintenanceTechnician(context);
}
