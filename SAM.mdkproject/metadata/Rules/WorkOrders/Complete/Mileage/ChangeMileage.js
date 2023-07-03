import libCommon from '../../../Common/Library/CommonLibrary';
import MileageAddEditNav from '../../../ServiceOrders/Mileage/MileageAddEditNav';
import ConstantsLibrary from '../../../Common/Library/ConstantsLibrary';
import WorkOrderCompletionLibrary from '../WorkOrderCompletionLibrary';

export default function ChangeMileage(context) {
    WorkOrderCompletionLibrary.setConfirmationType(context, 'mileage');
    if (WorkOrderCompletionLibrary.getStepDataLink(context, 'mileage')) {
        libCommon.setOnCreateUpdateFlag(context, ConstantsLibrary.updateFlag);
        context.getPageProxy().setActionBinding(WorkOrderCompletionLibrary.getStepData(context, 'mileage'));
        return context.executeAction('/SAPAssetManager/Actions/ServiceOrders/Mileage/MileageAddEditNav.action');
    } else {
        let binding = WorkOrderCompletionLibrary.getInstance().getBinding(context);
        libCommon.setStateVariable(context, 'WOBinding', binding);
        context.getPageProxy().setActionBinding(binding);
        //set the CHANGSET flag to true
        libCommon.setOnChangesetFlag(context, true);
        libCommon.resetChangeSetActionCounter(context);
        libCommon.setOnCreateUpdateFlag(context, ConstantsLibrary.createFlag);
        return MileageAddEditNav(context);
    }
}
