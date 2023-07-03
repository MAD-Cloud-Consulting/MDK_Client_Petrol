import IsOnCreate from '../../Common/IsOnCreate';
import MileageAddEditOperationQueryOptionsQueryBuilder from './MileageAddEditOperationQueryOptionsQueryBuilder';

export default function MileageAddEditOperationQueryOptions(listPickerProxy) {
    let binding = listPickerProxy.getPageProxy().binding;
    let orderId = '';

    if (IsOnCreate(listPickerProxy)) { //Binding object is WorkOrderHeader
        orderId = binding.OrderId;
    } else { //Binding object is Confirmation
        orderId = binding.OrderID;
    }

    return MileageAddEditOperationQueryOptionsQueryBuilder(listPickerProxy, orderId);
}
