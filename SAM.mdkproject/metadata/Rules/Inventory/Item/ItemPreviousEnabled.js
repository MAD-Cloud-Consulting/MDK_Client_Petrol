import ItemsData from './ItemsData';

export default function ItemPreviousEnabled(context) {
    const compareItem = context.getPageProxy().getClientData().item || context.binding;

    return ItemsData(context).then(items => {
        return compareItem['@odata.id'] !== items[0]['@odata.id'];
    });
}
