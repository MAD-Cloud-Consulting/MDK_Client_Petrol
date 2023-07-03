import IsOnCreate from '../../Common/IsOnCreate';

export default function MileageAddEditInitialOrderId(context) {
    let binding = context.binding;

    if (IsOnCreate(context)) { //Binding object is WorkOrderHeader
        return binding.OrderId;
    } else { //Binding object is Confirmation
        return binding.OrderID;
    }
}
