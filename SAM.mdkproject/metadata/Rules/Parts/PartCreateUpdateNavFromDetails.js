import libCom from '../Common/Library/CommonLibrary';
import EnableMultipleTechnician from '../SideDrawer/EnableMultipleTechnician';
/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function PartCreateUpdateNavFromDetails(clientAPI) {
    let flag = EnableMultipleTechnician(clientAPI) ? 'UPDATE' : 'CREATE';
    libCom.setOnCreateUpdateFlag(clientAPI, flag);
    return clientAPI.executeAction('/SAPAssetManager/Actions/Parts/VehiclePartCreateNav.action');
}
