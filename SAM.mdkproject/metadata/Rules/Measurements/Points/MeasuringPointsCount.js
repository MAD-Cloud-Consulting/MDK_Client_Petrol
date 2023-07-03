export default function MeasuringPointsCount(clientAPI) {
    return clientAPI.count('/SAPAssetManager/Services/AssetManager.service',clientAPI.getPageProxy().binding['@odata.readLink']+'/MeasuringPoints', '');    
}
