import libCom from '../Common/Library/CommonLibrary';
import notif from './NotificationLibrary';

/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function CheckForChangesBeforeCancel(context) { 
    if (libCom.unsavedChangesPresent(context)) {
        return context.executeAction('/SAPAssetManager/Actions/Notifications/CreateUpdate/ConfirmCancel.action');
    } else {
        if (notif.getAddFromOperationFlag(context)) {
            notif.setAddFromOperationFlag(context, false);
        }
    
        if (notif.getAddFromSuboperationFlag(context)) {
            notif.setAddFromSuboperationFlag(context, false);
        }

        libCom.setOnCreateUpdateFlag(context, '');

        // proceed with cancel without asking
        return context.executeAction('/SAPAssetManager/Actions/Page/CancelPage.action');
    }
}
