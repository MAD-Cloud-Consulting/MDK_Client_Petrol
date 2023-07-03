// eslint-disable-next-line no-unused-vars
export default function PurchaseOrderHeaderDescription(clientAPI) {
    // const binding = clientAPI.getBindingObject();
    // const query = `$filter=ObjectKey eq '${binding.PurchaseOrderId}' and TextObjType eq 'EKKO'`;
    // return clientAPI.read('/SAPAssetManager/Services/AssetManager.service', 'PurchaseOrderHeaderLongTexts', ['TextString'], query).then(results => {
    //     if (results && results.length > 0) {
    //         return results.getItem(0).TextString;
    //     }
    // });

    //Dummy space used to align the object header fields text on the PurchaseOrderDetails.page so that all relevant fields show up on the left side as in the global design figma.
    return ' ';
}
