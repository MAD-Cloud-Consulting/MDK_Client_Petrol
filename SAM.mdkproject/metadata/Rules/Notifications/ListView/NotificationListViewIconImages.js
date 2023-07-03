import libCommon from '../../Common/Library/CommonLibrary';
import isAndroid from '../../Common/IsAndroid';
export default function NotificationListViewIconImages(context) {
    var iconImage = [];
    // check if this Notification has any docs
    let docs = context.binding.NotifDocuments;

    if (docs && docs.length > 0) {
        //check to see if at least one of the documents has an associated document.
        let documentExists = docs.some(doc => doc.Document !== null);
        if (documentExists) {
            if (isAndroid(context)) {
                iconImage.push('/SAPAssetManager/Images/attachmentStepIcon.android.png');
            } else {
                iconImage.push('/SAPAssetManager/Images/attachmentStepIcon.png');
            }
        }
    }

    const {Tasks, Items, Activities} = context.binding;

    const localTasksExist = Tasks && Tasks.some(task => task['@sap.isLocal']);
    const localItemsExist = Items && Items.some(item => item['@sap.isLocal']);
    const localActivitiesExist = Activities && Activities.some(activity => activity['@sap.isLocal']);

    // check if this Notification has been locally created
    if (libCommon.getTargetPathValue(context,'#Property:@sap.isLocal') || libCommon.getTargetPathValue(context, '#Property:NotifMobileStatus_Nav/#Property:@sap.isLocal') || libCommon.getTargetPathValue(context, '#Property:HeaderLongText/#Property:0/#Property:@sap.isLocal') || localTasksExist || localItemsExist || localActivitiesExist) {
        iconImage.push(isAndroid(context) ? '/SAPAssetManager/Images/syncOnListIcon.android.png' : '/SAPAssetManager/Images/syncOnListIcon.png');
        return iconImage;
    }

    // Check for local changes to tasks, causes, and activities at the item level only if the previous check at notification level has not passed
    if (Items) {
        for (let i = 0; i < Items.length; i++) {
            const localItemTasksExist = Items[i].ItemTasks.some(task => task['@sap.isLocal']);
            const localItemCausesExist = Items[i].ItemCauses.some(cause => cause['@sap.isLocal']);
            const localItemActivitiesExist = Items[i].ItemActivities.some(activity => activity['@sap.isLocal']);
            if (localItemTasksExist || localItemCausesExist || localItemActivitiesExist) {
                iconImage.push(isAndroid(context) ? '/SAPAssetManager/Images/syncOnListIcon.android.png' : '/SAPAssetManager/Images/syncOnListIcon.png');
                return iconImage;
            }
        }
    }

    return iconImage;
}

