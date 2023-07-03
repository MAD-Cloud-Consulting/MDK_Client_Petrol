export default function ItemPreviousNextEnabled(context, compareItem, items) {
    const previousButton = context.getToolbarControls()[0];
    const nextButton = context.getToolbarControls()[2];

    if (compareItem['@odata.id'] === items[0]['@odata.id']) {
        previousButton.setEnabled(false);
    } else {
        previousButton.setEnabled(true);
    }

    if (compareItem['@odata.id'] === items[items.length - 1]['@odata.id']) {
        nextButton.setEnabled(false);
    } else {
        nextButton.setEnabled(true);
    }
}
