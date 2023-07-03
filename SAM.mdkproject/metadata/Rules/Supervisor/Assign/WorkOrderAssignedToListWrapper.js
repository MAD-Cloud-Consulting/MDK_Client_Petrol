import assignedTo from './WorkOrderAssignedTo';
import isSupervisorFeatureEnabled from '../isSupervisorFeatureEnabled';

export default function WorkOrderAssignedToListWrapper(context) {
    if (isSupervisorFeatureEnabled(context)) {
        return assignedTo(context, true).then((result) => {
            if (result === context.localizeText('unassigned')) {
                return context.localizeText('unassigned');
            }
            return context.localizeText('assignedto') + ' ' + result;
        });
    }
    return '';
}
