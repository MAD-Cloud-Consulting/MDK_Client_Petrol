import getInboundListQuery from '../Inbound/GetInboundListQuery';

export default function InboundKPIItems(context) {
    return getInboundListQuery(context, true).then(filter => {
        return context.count('/SAPAssetManager/Services/AssetManager.service', 'MyInventoryObjects', filter).then(function(inboundAllDocumentsCount) {
            return inboundAllDocumentsCount;
        });
    });
}
