/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function InspectionPointValuationStatusWithRead(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'], [], '$expand=InspValuation_Nav').then(result => {
        if (result && result.length > 0) {
            return result.getItem(0).InspValuation_Nav.ShortText;
        } else {
            return '-';
        }
    }).catch(() => {
        return '-';
    });
}
