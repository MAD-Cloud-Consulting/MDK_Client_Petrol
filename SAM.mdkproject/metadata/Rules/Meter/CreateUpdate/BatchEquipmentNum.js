export default function BatchEquipmentNum(context) {
    return context.binding.BatchEquipmentNum ? context.binding.BatchEquipmentNum : context.getClientData().BatchEquipmentNum;
}
