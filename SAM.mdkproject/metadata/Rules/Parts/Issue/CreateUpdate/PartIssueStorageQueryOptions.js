export default function PartIssueStorageQueryOptions(context) {
    let plant = '';
    let material = '';
    if (context.binding.RelatedItem) {
        plant = context.binding.RelatedItem[0].Plant; 
        material = context.binding.RelatedItem[0].Material; 
    } else {
        plant = context.binding.Plant; 
        material = context.binding.Material; 
    }
    return "$filter=MaterialNum eq '"+ material+ "' and Plant eq '"+ plant + "'";
}
