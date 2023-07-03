import libCom from '../../Common/Library/CommonLibrary';
export default function MeasurementDocsCount(clientAPI) {
    let entitySet = clientAPI.binding['@odata.readLink'];
    //This is for the Valcode count on gridTable
    if (!libCom.isDefined(entitySet)) {
        entitySet = "MeasuringPoints('"+clientAPI.binding.getItem(0).Point+"')";
    }
    return clientAPI.count('/SAPAssetManager/Services/AssetManager.service',entitySet+'/MeasurementDocs','');
}
