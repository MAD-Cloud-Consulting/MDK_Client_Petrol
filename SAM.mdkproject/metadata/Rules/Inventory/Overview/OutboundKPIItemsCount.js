import getOutboundListQuery from '../Outbound/GetOutboundListQuery';

export default function OutboundKPIItems(context) {
    return getOutboundListQuery(context, true).then(filter => {
        return context.count('/SAPAssetManager/Services/AssetManager.service', 'MyInventoryObjects', filter).then(function(outboundAllDocumentsCount) {
            return outboundAllDocumentsCount;
        });
    });
}
