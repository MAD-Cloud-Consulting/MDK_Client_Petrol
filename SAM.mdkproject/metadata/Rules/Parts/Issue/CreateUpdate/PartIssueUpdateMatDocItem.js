export default function PartIssueUpdateMatDocItem(context) {
    if (context.binding.RelatedItem) {
        return context.binding.RelatedItem[0].MatDocItem; 
    } else {
        return context.binding.MatDocItem;
    }
}
