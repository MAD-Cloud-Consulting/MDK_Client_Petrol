import libCom from '../Common/Library/CommonLibrary';
/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function PartCreateUpdateNavFromList(clientAPI) {
    libCom.setOnCreateUpdateFlag(clientAPI, 'CREATE');
    return clientAPI.executeAction('/SAPAssetManager/Actions/Parts/VehiclePartCreateNav.action');
}
