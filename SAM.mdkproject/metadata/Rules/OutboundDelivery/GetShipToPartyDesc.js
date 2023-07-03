import commonLib from '../Common/Library/CommonLibrary';
/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function GetShipToPartyDesc(clientAPI) {
    let binding = clientAPI.binding;
    if (commonLib.isDefined(binding.Customer_Nav.Name1)) {
        return binding.ShipToParty + ' - ' + binding.Customer_Nav.Name1;
    }
    return binding.ShipToParty;
}
