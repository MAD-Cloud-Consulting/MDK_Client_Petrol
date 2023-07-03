export default function PartIssueUpdateReadLink(context) {
    if (context.binding.RelatedItem) {
        return context.binding.RelatedItem[0].Plant; 
    } else {
        return context.binding.Plant;
    }
}
