
/**
 * This function returns the material object header field on PurchaseOrder or STO Details page
 */
 export default function GetMaterialName(context) {

    let type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
    let materialNum;
    if (type === 'MaterialDocItem' || type === 'InboundDeliveryItem' || type === 'OutboundDeliveryItem' || type === 'PhysicalInventoryDocItem') {
        materialNum = context.binding.Material;
    } else if (type === 'ProductionOrderItem') {
        // avoid extra request for PRD as it has description in the navlink
        return Promise.resolve(context.binding.Material_Nav.Description);
    } else {
        materialNum = context.binding.MaterialNum;
    }
    var queryOptions = "$filter=MaterialNum eq '" + materialNum +"'";
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'Materials', [], queryOptions).then((result) => {
        if (result && result.length > 0) {
            return result.getItem(0).Description;
        } else {
            return '';
        }
        // eslint-disable-next-line no-unused-vars
    }).catch(err => {
        return '';
    });
}
