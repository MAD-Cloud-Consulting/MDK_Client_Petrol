export default function GetDocumentItemBatchValue(context) {
    let batch = context.getPageProxy().getControl('FormCellContainer').getControl('BatchSimple').getValue();

    if (batch) {
        return batch.toUpperCase();
    }
    return '';
}
