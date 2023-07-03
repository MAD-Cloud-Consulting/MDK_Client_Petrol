/**
* Function to execute when returning to the page after filtering and set the caption with updated counter
*/
export default function MeasurementDocumentCreateUpdateOnReturn(context) {
    let count = context.getControl('FormCellContainer')._control.getFilteredItemsCount();
    let totalCount = context.getControl('FormCellContainer')._control.getTotalItemsCount();

    if (count === totalCount) {
        context.setCaption(context.localizeText('take_reading_x', [totalCount]));
    } else {
        context.setCaption(context.localizeText('take_reading_x_x', [count, totalCount]));
    }
}
