import libCommon from '../Common/Library/CommonLibrary';

export default function ReminderDelete(clientAPI) {
    const deleteEntityMessage = clientAPI.localizeText('reminder_delete_message');
    const deleteEntityTitle = clientAPI.localizeText('confirm_delete');
    return libCommon.showWarningDialog(clientAPI, deleteEntityMessage, deleteEntityTitle).then(successResult => {
        if (successResult === true) {
            return clientAPI.executeAction('/SAPAssetManager/Actions/Reminders/ReminderDelete.action');
        } 
        return null;
    });
}
