import IsOnCreate from '../../Common/IsOnCreate';

export default function MileageAddEditInitialOperation(context) {
    let binding = context.binding;

    if (IsOnCreate(context)) { 
        return binding.OperationNo ? binding.OperationNo : '';
    } else { //Binding object is Confirmation
        return binding.Operation;
    }
}
