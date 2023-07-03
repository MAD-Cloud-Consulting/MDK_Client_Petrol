/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function SelectOrUnselectedIconShowAndroid(clientAPI) {
    if (clientAPI.binding.Description) {
        return '';
    }
    return clientAPI.binding.selected
        ? '/SAPAssetManager/Images/Checkbox_selected.png'
        : '/SAPAssetManager/Images/Check.png';
}
