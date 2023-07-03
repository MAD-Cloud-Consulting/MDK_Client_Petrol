

export default function EquipmentOrFLOCTransactionID(context) {

    if (context.binding.SuperiorEquip) {
        return context.binding.SuperiorEquip;
    } else if (context.binding.FuncLocIdIntern) {
        return context.binding.FuncLocIdIntern;
    } else if (context.binding.DismantleEquip) {
        return context.binding.DismantleEquip;
    } else if (context.binding.DismantleFuncLocIdIntern) {
        return context.binding.DismantleFuncLocIdIntern;
    }
 
    return '';
}
