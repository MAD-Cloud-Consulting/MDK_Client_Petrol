import ItemsData from './ItemsData';

export default function ItemPageOnReturning(context) {
    let item = context.getPageProxy().getClientData().item;
    if (item && item['@odata.id'] !== context.binding['@odata.id']) {
        return ItemsData(context).then(items => {

            for (let i = 0; i < items.length; i++) {
                const value = items[i];
                if (value['@odata.id'] === item['@odata.id']) {
                    context.getPageProxy().getClientData().item = value;
                }
            }
            context.getPageProxy().getControl('SectionedTable').redraw();
        });
    }
}
