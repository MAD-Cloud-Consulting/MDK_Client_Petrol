import assignedTo from './WorkOrderOperationAssignedTo';
import isSupervisorFeatureEnabled from '../isSupervisorFeatureEnabled';

export default function WorkOrderOperationAssignedToListWrapper(context) {
    if (isSupervisorFeatureEnabled(context)) {
        return assignedTo(context).then((result) => {
            if (result === context.localizeText('unassigned')) {
                return context.localizeText('unassigned');
            }
            return context.localizeText('assignedto') + ' ' + result;
        });
    }
    return '';
}
