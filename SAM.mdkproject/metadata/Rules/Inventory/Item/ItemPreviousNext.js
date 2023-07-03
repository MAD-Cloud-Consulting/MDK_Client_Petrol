import ItemPreviousNextEnabled from './ItemPreviousNextEnabled';
import ItemsData from './ItemsData';

export default function ItemPreviousNext(context) {
    const currentItem = context.getPageProxy().getClientData().item || context.binding;
    const type = currentItem['@odata.type'].substring('#sap_mobile.'.length);
    const isNext = context._control.name === 'NextItem';

    return ItemsData(context).then(items => {
        // ItemNum property is a string and we want previous/next buttons to work with numeric indices
        const sortedItems = items.sort((a, b) => Number(a.ItemNum) - Number(b.ItemNum));
        const comparedIndex = isNext ? 1 : -1;
        for (let i = 0; i < sortedItems.length; i++) {
            if (items[i]['@odata.id'] === currentItem['@odata.id']) {
                const comparedItem = sortedItems[i + comparedIndex];
                context.getPageProxy().getClientData().item = comparedItem;
                let text = 'item_item_number';
                let itemNum = comparedItem.ItemNum;

                if (type === 'InboundDeliveryItem' || type === 'OutboundDeliveryItem' || type === 'PhysicalInventoryDocItem') {
                    itemNum = comparedItem.Item;
                } else if (type === 'MaterialDocItem') {
                    text = 'material_document_item_number';
                    itemNum = comparedItem.MatDocItem;
                    context.getPageProxy().setActionBarItemVisible(0, comparedItem['@sap.isLocal']);
                }

                context.getPageProxy().setCaption(context.localizeText(text, [itemNum]));
                ItemPreviousNextEnabled(context, comparedItem, sortedItems);
            }
        }

        context.getPageProxy().getControl('SectionedTable').redraw();
    });
}
