import isAndroid from '../../Common/IsAndroid';

export default function ShowAccessoryButtonIcon(context) {
    let icon = '';
    let query = `$filter=ReferenceDocHdr eq '${context.binding.MaterialDocNumber}' and ReferenceDocItem eq '${context.binding.MatDocItem}'`;

    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MaterialDocItems', ['MaterialDocNumber'], query).then(result => {
        if (!result.getItem(0)) {
            icon = isAndroid(context) ? '/SAPAssetManager/Images/edit-accessory.android.png' : '/SAPAssetManager/Images/edit-accessory.ios.png';
        }
        return icon;
    });
}
