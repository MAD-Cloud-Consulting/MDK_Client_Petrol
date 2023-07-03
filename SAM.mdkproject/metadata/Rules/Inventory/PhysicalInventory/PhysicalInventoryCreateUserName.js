import libCom from '../../Common/Library/CommonLibrary';
/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function PhysicalInventoryCreateUserName(context) {
    return libCom.getSapUserName(context);
}
