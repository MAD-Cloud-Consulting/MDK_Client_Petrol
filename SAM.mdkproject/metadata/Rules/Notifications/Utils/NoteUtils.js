import libCommon from '../../Common/Library/CommonLibrary';
import Constants from '../../Common/Library/ConstantsLibrary';
import { NoteLibrary as NoteLib } from '../../Notes/NoteLibrary';
import notif from '../../Notifications/NotificationLibrary';


export default class {

    static createNoteIfDefined(context, transactionType, noteFieldKey = Constants.longTextNoteFieldKey) {
        //In order to handle note creation during the changeset action we need to keep a counter of the all the acitons for readlink purposes
        libCommon.incrementChangeSetActionCounter(context);

        let note = libCommon.getFieldValue(context, noteFieldKey, null);

        // Executed if Note is present, regardless of entity-type create
        if (note) {
            NoteLib.setNoteTypeTransactionFlag(context, transactionType);

            if (transactionType.noteCreateAction) {
                // If there is an otherwise defined note create action, execute it
                return context.executeAction(transactionType.noteCreateAction).then(function() {
                    // Handle Changeset Counter Increment for required Notification Partners
                    if (transactionType && transactionType.name === 'Notification') {
                        if (context.evaluateTargetPathForAPI('#Control:PartnerPicker1')._control.visible && context.evaluateTargetPath('#Control:PartnerPicker1/#SelectedValue')) {
                            libCommon.incrementChangeSetActionCounter(context);
                        }
                        if (context.evaluateTargetPathForAPI('#Control:PartnerPicker2')._control.visible && context.evaluateTargetPath('#Control:PartnerPicker2/#SelectedValue')) {
                            libCommon.incrementChangeSetActionCounter(context);
                        }
                    }
                });
            }

            return context.executeAction('/SAPAssetManager/Actions/Notes/NoteCreateDuringEntityCreate.action');
        }

        // Executed if no Note is present only on Notification Create
        if (transactionType && transactionType.name === 'Notification' && (libCommon.getNotificationAssignmentType(context) === '1' || notif.getAddFromOperationFlag(context) || notif.getAddFromSuboperationFlag(context))) {
            if (context.evaluateTargetPathForAPI('#Control:PartnerPicker1')._control.visible && context.evaluateTargetPath('#Control:PartnerPicker1/#SelectedValue')) {
                libCommon.incrementChangeSetActionCounter(context);
            }
            if (context.evaluateTargetPathForAPI('#Control:PartnerPicker2')._control.visible && context.evaluateTargetPath('#Control:PartnerPicker2/#SelectedValue')) {
                libCommon.incrementChangeSetActionCounter(context);
            }
            if (libCommon.getNotificationAssignmentType(context) === '1') {
                libCommon.incrementChangeSetActionCounter(context);
            }
            if (notif.getAddFromOperationFlag(context)) {
                libCommon.incrementChangeSetActionCounter(context);
            } else if (notif.getAddFromSuboperationFlag(context)) {
                libCommon.incrementChangeSetActionCounter(context);
            }
        }
        if (transactionType && transactionType.entitySet === 'MyNotificationHeaders' || transactionType.entitySet === 'MyNotificationItems') { // Only close the page if we are NOT on Notification Header or Item
            return Promise.resolve();
        }
        return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
    }

}
