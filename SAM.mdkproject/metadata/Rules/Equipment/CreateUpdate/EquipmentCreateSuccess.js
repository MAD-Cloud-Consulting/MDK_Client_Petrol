import libCommon from '../../Common/Library/CommonLibrary';

/**
* Calls on successful creation of equipment and increment equipment counter
* @param {IClientAPI} clientAPI
*/
export default function EquipmentCreateSuccess(clientAPI) {
    libCommon.incrementChangeSetActionCounter(clientAPI);
}
