import libCom from '../../../Common/Library/CommonLibrary';
import EnableMultipleTechnician from '../../../SideDrawer/EnableMultipleTechnician';
import SetStockTransfer from './SetStockTransfer';
/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function TransferFromDetails(clientAPI) {
    let flag = EnableMultipleTechnician(clientAPI) ? 'UPDATE' : 'CREATE';
    libCom.setOnCreateUpdateFlag(clientAPI, flag);
    return SetStockTransfer(clientAPI);
}
