export default function WorkOrderSubOperationsCount(sectionProxy) {
    let binding = sectionProxy.getPageProxy().binding;
    return sectionProxy.count('/SAPAssetManager/Services/AssetManager.service', binding['@odata.readLink'] + '/SubOperations', '');
}
