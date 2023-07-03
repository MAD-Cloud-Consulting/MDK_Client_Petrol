
export default function PartBatchNumberQueryOptions(context) {
    let materialNum = context.binding.MaterialNum || '';
    let plant = context.binding.Plant || '';

    if (context.binding.RelatedItem && context.binding.RelatedItem.length) {
        plant = context.binding.RelatedItem[0].Plant; 
        materialNum = context.binding.RelatedItem[0].Material; 
    }

    return `$filter=Plant eq '${plant}' and MaterialNum eq '${materialNum}'`;
}
