import getPhysicalListQuery from '../PhysicalInventory/GetPhysicalListQuery';

export default function PhysicalKPIItemsCount(context) {
    return getPhysicalListQuery(context, true).then(filter => {
        return context.count('/SAPAssetManager/Services/AssetManager.service', 'MyInventoryObjects', filter).then(function(documentsCount) {
                return documentsCount;
        });
    });
}
