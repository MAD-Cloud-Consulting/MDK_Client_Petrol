import queryOptions from './GetInboundOutboundListQuery';
/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function GetInboundOutboundItemsCount(context) {
    return queryOptions(context, true).then(query => {
        return queryOptions(context, false, true).then(querySearch => {
            return context.count('/SAPAssetManager/Services/AssetManager.service', 'MyInventoryObjects', query).then(count => {
                return context.count('/SAPAssetManager/Services/AssetManager.service', 'MyInventoryObjects', querySearch).then(searchCount => {
                    if (searchCount === count) {
                        return context.localizeText('all_caption', [count]);
                    }
                    return context.localizeText('all_caption_double', [searchCount, count]);
                });
            });
        });
    });
}
