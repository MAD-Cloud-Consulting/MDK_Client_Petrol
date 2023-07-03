export default function PhysicalInventoryDocCountTotals(context, status=false, readLink) {

    let binding = context.binding;
    let target = binding['@odata.readLink'];

    if (readLink) {
        target = readLink;
    }

    let countEntity = target + '/PhysicalInventoryDocItem_Nav';
    let totalCountPromise = context.count('/SAPAssetManager/Services/AssetManager.service', countEntity, '');
    let countedPromise = context.count('/SAPAssetManager/Services/AssetManager.service', countEntity,"$filter=EntryQuantity gt 0 or ZeroCount eq 'X'");

    return Promise.all([totalCountPromise, countedPromise]).then(function(counts) {
        let totalCount = counts[0];
        let count = counts[1];
        let params = [];

        params.push(count);
        params.push(totalCount);

        if (status) { //Return the status only instead of formatted count totals (tag on PI details)
            if (count === totalCount) {
                return context.localizeText('pi_counted');
            } else if (count > 0) {
                return context.localizeText('pi_partially_counted');
            } else if (count === 0) {
                return context.localizeText('pi_uncounted');
            }
            return '';
        }
       
        return context.localizeText('pi_counted_of_total', params);
    });
}
