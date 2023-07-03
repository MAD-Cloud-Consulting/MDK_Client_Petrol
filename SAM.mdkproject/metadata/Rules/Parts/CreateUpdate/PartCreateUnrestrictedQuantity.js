/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function PartCreateUnrestrictedQuantity(clientAPI) {
    if (clientAPI.binding) {
        return clientAPI.binding.UnrestrictedQuantity;
    }
    return 0;
}
