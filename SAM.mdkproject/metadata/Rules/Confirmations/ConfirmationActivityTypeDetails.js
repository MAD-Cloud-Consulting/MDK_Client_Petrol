
import fetchActivityType from './FetchActivityType';

export default function ConfirmationActivityTypeDetails(context) {

    let binding = context.getBindingObject();
    
    return fetchActivityType(context, binding.WorkOrderHeader.ControllingArea, binding.ActivityType).then(activityType => {
        if (activityType === undefined) {
            return '-';
        }
        return activityType.ActivityType + (activityType.ActivityTypeDescription.length > 0 ? ' - ' + activityType.ActivityTypeDescription : '');
    });
}
