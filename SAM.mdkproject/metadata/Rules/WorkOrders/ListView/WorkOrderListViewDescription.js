import WorkOrderAssignedToListWrapper from '../../Supervisor/Assign/WorkOrderAssignedToListWrapper';
import IsPhaseModelEnabled from '../../Common/IsPhaseModelEnabled';

export default function WorkOrderListViewDescription(context) {
    // Assigned Person
    let assignee = WorkOrderAssignedToListWrapper(context);

    if (IsPhaseModelEnabled(context)) {
        let binding = context.getBindingObject();
        let descriptionFields = [assignee];

        // Phase / Subphase Description
        if (binding && binding.OrderMobileStatus_Nav && binding.OrderMobileStatus_Nav.OverallStatusCfg_Nav) {
            let status = binding.OrderMobileStatus_Nav.OverallStatusCfg_Nav;
            descriptionFields.push(status.PhaseDesc + ' (' + status.SubphaseDesc + ')');
        }

        return Promise.all(descriptionFields).then(fieldData => {
            let result = '';
            let i = 0; while (i < fieldData.length - 1) {
                result += fieldData[i++] + '\n';
            }
            result += fieldData[i];
            return result;
        });
    }

    return assignee;
}
