/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function GetSigningApplicaiton(context) {
    let value = context.getClientData().SigningApplication;
    return value;
}
