/**
 * Gets Material number and description from local database as it stored here
 */

export default function GetMaterialData(context) {
    let binding = context.binding;
    if (binding) {
        if (binding.ProductionOrderHeader_Nav) {
            binding = binding.ProductionOrderHeader_Nav;
        }
        if (binding.ProductionOrderItem_Nav.length
            && binding.ProductionOrderItem_Nav[0].Material_Nav) {
            let material = binding.ProductionOrderItem_Nav[0].Material_Nav;
            if (material) {
                return `${material.MaterialNum} - ${material.Description}`;
            }
        }
    }
    return '';
}
