/**
* The Operation Picker should only be editable if there is an Order selected
* @param {IClientAPI} context
*/
import IsOnCreate from '../../Common/IsOnCreate';

export default function MileageAddEditOperationIsEditable(listPickerProxy) {
    let binding = listPickerProxy.getPageProxy().binding;
    let orderId = '';

    if (IsOnCreate(listPickerProxy)) { //Binding object is WorkOrderHeader
        orderId = binding.OrderId;
    } else { //Binding object is Confirmation
        orderId = binding.OrderID;
    }

    return orderId ? true : false;
}
