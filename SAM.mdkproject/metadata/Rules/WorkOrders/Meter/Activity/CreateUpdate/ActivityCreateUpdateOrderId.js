export default function ActivityCreateUpdateOrderId(context) {
    if (context.binding.MyWorkOrderOperation) { //Operation level assignment
        return context.binding.MyWorkOrderOperation.OrderId;
    } else if (context.binding.MyWorkOrderSubOperation) { //Suboperation level assignment
        return context.binding.MyWorkOrderSubOperation.OrderId;
    } else {
        return context.binding.OrderId;
    }
}
