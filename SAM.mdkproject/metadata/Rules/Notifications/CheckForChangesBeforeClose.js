import libCom from '../Common/Library/CommonLibrary';
import notif from './NotificationLibrary';

/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function CheckForChangesBeforeClose(context) {
    if (libCom.unsavedChangesPresent(context)) {
        return context.executeAction('/SAPAssetManager/Actions/Notifications/CreateUpdate/ConfirmClose.action');
    } else {
        libCom.setOnCreateUpdateFlag(context, '');
        if (notif.getAddFromOperationFlag(context)) {
            notif.setAddFromOperationFlag(context, false);
        }

        if (notif.getAddFromSuboperationFlag(context)) {
            notif.setAddFromSuboperationFlag(context, false);
        }
        // proceed with cancel without asking
        return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
    }
}
