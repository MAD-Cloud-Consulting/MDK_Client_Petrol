export default function ShowRemoveIcon(clientAPI) {
    return clientAPI.binding.downloaded
        ? ''
        : '/SAPAssetManager/Images/xmark.png';
}
