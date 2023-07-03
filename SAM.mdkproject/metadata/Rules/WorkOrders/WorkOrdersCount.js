export default function WorkOrdersCount(sectionProxy, queryOption = '') {
    return sectionProxy.count('/SAPAssetManager/Services/AssetManager.service','MyWorkOrderHeaders', queryOption).then((count) => {
        return count;
    });
}
