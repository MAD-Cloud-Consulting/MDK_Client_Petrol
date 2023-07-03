import CommonLibrary from '../../Common/Library/CommonLibrary';
import ConstantsLibrary from '../../Common/Library/ConstantsLibrary';
import IsCompleteAction from '../../WorkOrders/Complete/IsCompleteAction';

export default function MileageAddNav(context) {
    //set the CHANGSET flag to true
    CommonLibrary.setOnChangesetFlag(context, true);
    CommonLibrary.resetChangeSetActionCounter(context);
    CommonLibrary.setOnCreateUpdateFlag(context, ConstantsLibrary.createFlag);

    if (IsCompleteAction(context)) {
        let binding = CommonLibrary.getStateVariable(context, 'WOBinding');
        context.setActionBinding(binding);
    }
    
    return context.executeAction('/SAPAssetManager/Actions/ServiceOrders/Mileage/MileageAddChangeSet.action');
}
