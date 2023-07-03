/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function GetSigningApplicationSubObject(context) {
    let value = context.getClientData().SigningApplicationSubObject;
    return value;
}
