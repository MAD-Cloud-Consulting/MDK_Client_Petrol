import IsOnCreate from '../../Common/IsOnCreate';

export default function MileageAddEditIsWorkCenterEditable(context) {

    if (IsOnCreate(context)) {
        let binding = context.getPageProxy().binding;

        return binding.OperationNo ? true : false;
    } else {
        return true;
    }
}
