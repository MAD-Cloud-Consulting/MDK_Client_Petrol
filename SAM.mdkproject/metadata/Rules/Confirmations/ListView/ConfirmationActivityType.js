import fetchActivityType from '../FetchActivityType';

export default function ConfirmationActivityType(context) {

    // Page binding is Work Order
    let workOrder = context.getPageProxy().getBindingObject();
    // Confirmation is control binding
    let confirmation = context.getBindingObject();
    return fetchActivityType(context, workOrder.ControllingArea, confirmation.ActivityType).then(activityType => {

        if (activityType === undefined) {
            return '-';
        }

        return activityType.ActivityTypeDescription;
    });
}
