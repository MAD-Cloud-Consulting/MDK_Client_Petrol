/**
* Remove User Switch Header if present
* @param {IClientAPI} context
*/
export default function RemoveHeader(context, headerName) {
    let provider = context.getODataProvider('/SAPAssetManager/Services/AssetManager.service');
    let storeParameters = provider.getOfflineParameters();
    let headers = storeParameters.getCustomHeaders();
    if (headers) {
        delete headers[headerName];
        storeParameters.setCustomHeaders(headers);
    }
}
