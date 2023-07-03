/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function InspectionPointCodeWithRead(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'], [], '$expand=InspCode_Nav').then(result => {
        if (result && result.length > 0) {
            return result.getItem(0).InspCode_Nav.CodeDesc;
        } else {
            return '-';
        }
    }).catch(() => {
        return '-';
    });
}
