import libCom from '../../../Common/Library/CommonLibrary';
import SetStockTransfer from './SetStockTransfer';
/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function TransferFromList(clientAPI) {
    libCom.setOnCreateUpdateFlag(clientAPI, 'CREATE');
    return SetStockTransfer(clientAPI);
}
