import libCommon from '../../Common/Library/CommonLibrary';
import { NoteLibrary as NoteLib } from '../../Notes/NoteLibrary';
import notif from '../../Notifications/NotificationLibrary';
import ExecuteActionWithAutoSync from '../../ApplicationEvents/AutoSync/ExecuteActionWithAutoSync';

export default function NotificationCreateNoteCreate(context) {

    libCommon.incrementChangeSetActionCounter(context);

    let transactionType = NoteLib.getNoteTypeTransactionFlag(context);

    if (transactionType && transactionType.name === 'Notification' && (libCommon.getNotificationAssignmentType(context) === '1' || notif.getAddFromOperationFlag(context) || notif.getAddFromSuboperationFlag(context))) {
        if (libCommon.getNotificationAssignmentType(context) === '1') {
            libCommon.incrementChangeSetActionCounter(context);
        }
        if (notif.getAddFromOperationFlag(context)) {
            libCommon.incrementChangeSetActionCounter(context);
        } else if (notif.getAddFromSuboperationFlag(context)) {
            libCommon.incrementChangeSetActionCounter(context);
        }
    }

    if (context.binding && context.binding['@odata.type'] === '#sap_mobile.InspectionCharacteristic') {
    //We have created a new note for a new notification by recording a defect from EAM Checklist.
    //We don't want to run NoteCreateSuccessMessage.action because that closes the current page which we still want open at this point 
    //because we are not yet finished creating the notification. After adding a note we are going to create the notification item next.
        libCommon.setOnCreateUpdateFlag(context, '');    
        return Promise.resolve();
    } else if (!libCommon.isOnChangeset(context) // For individual note create the change set flag would be false
        || transactionType && transactionType.entitySet !== 'MyNotificationHeaders' && transactionType.entitySet !== 'MyNotificationItems') {
        // Show Note success message if we are NOT in Notification or Item Create
        libCommon.setOnCreateUpdateFlag(context, '');
        return ExecuteActionWithAutoSync(context, '/SAPAssetManager/Actions/Notes/NoteCreateSuccessMessage.action');
    }
}
