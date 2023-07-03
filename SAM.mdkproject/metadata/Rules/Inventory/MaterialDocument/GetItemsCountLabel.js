/**
* Return count of items, that are available for document
* @param {IClientAPI} context
*/
export default function GetItemsCountLabel(context, doc) {
    let query = `$filter=MaterialDocNumber eq '${doc.MaterialDocNumber}'`;
    return context.count('/SAPAssetManager/Services/AssetManager.service', 'MaterialDocItems', query).then(count => {
        return context.localizeText('number_of_items', [count]);
    });
}
