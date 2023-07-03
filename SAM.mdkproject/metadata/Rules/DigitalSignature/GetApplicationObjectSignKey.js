/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function GetApplicationObjectSignKey(context) {
    let value = context.getClientData().ApplicationObjectSignKey;
    return value;
}
