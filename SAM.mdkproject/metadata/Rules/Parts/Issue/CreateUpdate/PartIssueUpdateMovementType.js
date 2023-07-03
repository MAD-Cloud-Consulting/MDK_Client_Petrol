export default function PartIssueUpdateMovementType(context) {
    if (context.binding.RelatedItem) {
        return context.binding.RelatedItem[0].MovementType; 
    } else {
        return context.binding.MovementType;
    }
}
