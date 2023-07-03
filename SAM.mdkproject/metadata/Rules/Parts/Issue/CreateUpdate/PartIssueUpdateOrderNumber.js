export default function PartIssueUpdateOrderNumber(context) {
    if (context.binding.RelatedItem) {
        return context.binding.RelatedItem[0].OrderNumber; 
    } else {
        return context.binding.OrderNumber;
    }
}
