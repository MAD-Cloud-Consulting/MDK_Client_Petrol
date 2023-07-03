import libCommon from '../../Common/Library/CommonLibrary';
import isAndroid from '../../Common/IsAndroid';

export default function NotificationItemIconImages(context) {
    
    const {ItemTasks, ItemCauses, ItemActivities} = context.binding;

    const localTasksExist = ItemTasks && ItemTasks.some(task => task['@sap.isLocal']);
    const localCausesExist = ItemCauses && ItemCauses.some(cause => cause['@sap.isLocal']);
    const localActivitiesExist = ItemActivities && ItemActivities.some(activity => activity['@sap.isLocal']);

    // check if this Notification Item has been locally created
    if (libCommon.getTargetPathValue(context,'#Property:@sap.isLocal') || localTasksExist || localCausesExist || localActivitiesExist) {
        return [isAndroid(context) ? '/SAPAssetManager/Images/syncOnListIcon.android.png' : '/SAPAssetManager/Images/syncOnListIcon.png'];
    } else {
        return [];
    }
}
