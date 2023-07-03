export default function PhysicalInventoryDocAndDescription(context) {

    let binding = context.binding;
    let doc = binding.PhysInvDoc + '-' + binding.FiscalYear;
    let desc = binding.description;
    if (desc) {
        return doc + ' ' + desc;
    }
    return doc;
}
