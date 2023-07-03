import ComLib from '../Common/Library/CommonLibrary';

export default function ReminderUpdateNav(clientAPI) {
    //Set the global TransactionType variable to UPDATE
    ComLib.setOnCreateUpdateFlag(clientAPI, 'UPDATE');
    return clientAPI.executeAction('/SAPAssetManager/Actions/Reminders/ReminderCreateUpdateNav.action');
}
