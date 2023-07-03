import libCom from '../../Common/Library/CommonLibrary';

export default function ItemsData(context) {
    const itemsQuery = libCom.getStateVariable(context, 'ItemsQuery');

    return context.read('/SAPAssetManager/Services/AssetManager.service', itemsQuery.entitySet, [], itemsQuery.query).then(data => {
        const items = [];
        for (let i = 0; i < data.length; i++) {
            items[i] = data.getItem(i);
        }

        return items;
    });
}
