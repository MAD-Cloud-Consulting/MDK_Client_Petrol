export default function InspectionLotWorkOrderFilterIsEditable(context) {
    return !(context.binding && context.binding.OrderId);
}
