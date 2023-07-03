export default function PartIssueUpdateEntryUOM(context) {
    if (context.binding.RelatedItem) {
        return context.binding.RelatedItem[0].EntryUOM; 
    } else {
        return context.binding.EntryUOM;
    }
}
