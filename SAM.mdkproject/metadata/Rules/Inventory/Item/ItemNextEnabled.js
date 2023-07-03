import ItemsData from './ItemsData';

export default function ItemNextEnabled(context) {
    const compareItem = context.getPageProxy().getClientData().item || context.binding;
    
    return ItemsData(context).then(items => {
        return compareItem['@odata.id'] !== items[items.length - 1]['@odata.id'];
    });
}
