import libComm from '../../Common/Library/CommonLibrary';
/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function PartOnCreate(clientAPI) {
    return libComm.IsOnCreate(clientAPI);
}
