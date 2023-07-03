export default function PartIssueUpdateReadLink(context) {
    if (context.binding.RelatedItem) {
        return context.binding.RelatedItem[0]['@odata.readLink']; 
    } else {
        return context.binding['@odata.readLink'];
    }
}
