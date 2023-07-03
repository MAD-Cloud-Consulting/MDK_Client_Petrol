/**
* Return the Inspection Lot description if there is one or the Id
* @param {IClientAPI} context
*/
export default function InspectionLotDescriptionOrId(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'], [], '$expand=InspectionLot_Nav').then(result => {
        if (result && result.length > 0) {
            return result.getItem(0).InspectionLot_Nav.ShortDesc ? result.getItem(0).InspectionLot_Nav.ShortDesc : result.getItem(0).InspectionLot_Nav.InspectionLot;
        } else {
            return '-';
        }
    }).catch(() => {
        return '-';
    });
}
