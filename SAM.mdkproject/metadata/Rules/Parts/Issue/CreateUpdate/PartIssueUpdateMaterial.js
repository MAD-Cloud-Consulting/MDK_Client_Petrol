export default function PartIssueUpdateMaterial(context) {
    if (context.binding.RelatedItem) {
        return context.binding.RelatedItem[0].Material; 
    } else {
        return context.binding.Material;
    }
}
