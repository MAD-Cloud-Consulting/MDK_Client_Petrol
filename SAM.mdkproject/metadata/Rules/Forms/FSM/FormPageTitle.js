/**
* Set the form Caption
* @param {IClientAPI} clientAPI
*/
export default function FormPageTitle(clientAPI) {
    return clientAPI.getPageProxy().binding.FSMFormTemplate_Nav.Name;
}
