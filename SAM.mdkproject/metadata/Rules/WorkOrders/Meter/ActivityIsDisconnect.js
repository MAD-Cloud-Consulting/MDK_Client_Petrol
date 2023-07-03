export default function ActivityIsDisconnect(context) {
    if (context.binding.MyWorkOrderSubOperation) { //Subopeartion level assignment
        return context.binding.MyWorkOrderSubOperation.WorkOrderOperation.WOHeader.OrderISULinks[0].ISUProcess === 'DISCONNECT' ? 'X' : '';
    } else if (context.binding.MyWorkOrderOperation) { //Operation level assignment
        return context.binding.MyWorkOrderOperation.WOHeader.OrderISULinks[0].ISUProcess === 'DISCONNECT' ? 'X' : '';
    } else {
        return context.binding.WOHeader_Nav.OrderISULinks[0].ISUProcess === 'DISCONNECT' ? 'X' : '';
    }
}
