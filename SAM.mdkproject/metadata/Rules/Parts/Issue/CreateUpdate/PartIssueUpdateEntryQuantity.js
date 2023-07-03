export default function PartIssueUpdateReadLink(context) {
    if (context.binding.RelatedItem) {
        return context.formatNumber(context.binding.RelatedItem[0].EntryQuantity); 
    } else {
        return context.formatNumber(context.binding.EntryQuantity);
    }
}
