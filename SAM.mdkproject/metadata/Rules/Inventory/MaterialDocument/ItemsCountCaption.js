import newlyCreatedDocsQuery from './NewlyCreatedDocsQuery';
/**
* Return count of items, that are available for document
* @param {IClientAPI} context
*/
export default function ItemsCountCaption(context) {
    let query = newlyCreatedDocsQuery(context);
    return context.count('/SAPAssetManager/Services/AssetManager.service', 'MaterialDocItems', query).then(count => {
        if (count) {
            return context.localizeText('items_list_count', [count]);
        }
        return context.localizeText('items_list_count', [0]);
    });
}
