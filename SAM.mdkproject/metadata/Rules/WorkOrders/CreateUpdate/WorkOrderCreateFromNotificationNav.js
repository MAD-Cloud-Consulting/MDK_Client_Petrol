import libCommon from '../../Common/Library/CommonLibrary';
import assnType from '../../Common/Library/AssignmentType';
import lamCopy from './WorkOrderCreateLAMCopy';
import { WorkOrderLibrary as libWo } from '../WorkOrderLibrary';

export default function WorkOrderCreateFromNotificationNav(context) {
    //Remove variable FollowUpFlagPage before create
    libWo.removeFollowUpFlagPage(context);

    //Set the global TransactionType variable to CREATE
    libCommon.setOnCreateUpdateFlag(context, 'CREATE');

    //set the CHANGSET flag to true
    libCommon.setOnChangesetFlag(context, true);
    libCommon.setOnWOChangesetFlag(context, true);
    libCommon.resetChangeSetActionCounter(context);

    libCommon.removeStateVariable(context, 'WODefaultPlanningPlant');
    libCommon.removeStateVariable(context, 'WODefaultWorkCenterPlant');
    libCommon.removeStateVariable(context, 'WODefaultMainWorkCenter');

    let binding = context.binding;
    let actionBinding = {
        OrderDescription: binding.NotificationDescription,
        PlanningPlant: binding.PlanningPlant,
        OrderType: libCommon.getAppParam(context, 'WORKORDER', 'OrderType'),
        Priority: binding.Priority,
        HeaderFunctionLocation: binding.HeaderFunctionLocation,
        HeaderEquipment: binding.HeaderEquipment,
        BusinessArea: '',
        MainWorkCenterPlant: assnType.getWorkOrderFieldDefault('WorkOrderHeader', 'WorkCenterPlant'),
        MainWorkCenter: assnType.getWorkOrderFieldDefault('WorkOrderHeader', 'MainWorkCenter'),
        FromNotification: true,
        NotificationNumber: context.binding.NotificationNumber,
    };

    context.setActionBinding(actionBinding);
    libCommon.setStateVariable(context, 'LocalId', ''); //Reset before starting create
    return context.executeAction('/SAPAssetManager/Actions/WorkOrders/CreateUpdate/WorkOrderCreateChangeset.action').then(() => {
        return lamCopy(context).then(() => {
            //Check if a new workorder was created successfully. If so, update the current Notification with the new OrderId
            let localId = libCommon.getStateVariable(context, 'LocalId');
            if (localId) {
                binding.LocalWorkOrderId = localId;
                binding.LocalWorkOrderReadLink = "MyWorkOrderHeaders('" + localId + "')";
                return context.executeAction('/SAPAssetManager/Actions/Notifications/CreateUpdate/NotificationUpdateWorkOrderId.action');
            }

            return Promise.resolve(true);
        });
        
    });
}
