/**
* Determine if Save button should be visible or not
* @param {IClientAPI} clientAPI
*/
export default function FSMFormSaveVisible(clientAPI) {
    return !clientAPI.getPageProxy().binding.Closed;
}
