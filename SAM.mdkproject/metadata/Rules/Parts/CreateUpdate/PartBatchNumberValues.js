
export default function PartBatchNumberValues(context) {
    if (context.binding.MaterialBatch_Nav) {
        return context.binding.MaterialBatch_Nav.Batch;
    }

    if (context.binding.RelatedItem && context.binding.RelatedItem.length 
            && context.binding.RelatedItem[0].Batch) {
        return context.binding.RelatedItem[0].Batch;
    }

    if (context.binding.Batch) {
        return context.binding.Batch;
    }

    return '';
}
