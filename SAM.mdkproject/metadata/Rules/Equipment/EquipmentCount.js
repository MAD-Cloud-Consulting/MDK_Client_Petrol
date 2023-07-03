export default function EquipmentCount(sectionProxy) {
    return sectionProxy.count('/SAPAssetManager/Services/AssetManager.service', 'MyEquipments', '').then((count) => {
        sectionProxy.getPageProxy().getClientData().EquipmentTotalCount = count;
        return count;
    });   
}
