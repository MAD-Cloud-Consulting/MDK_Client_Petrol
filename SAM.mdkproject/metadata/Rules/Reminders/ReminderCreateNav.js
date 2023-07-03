import ComLib from '../Common/Library/CommonLibrary';

export default function ReminderCreateNav(clientAPI) {
    //Set the global TransactionType variable to CREATE
    ComLib.setOnCreateUpdateFlag(clientAPI, 'CREATE');
    clientAPI.executeAction('/SAPAssetManager/Actions/Reminders/ReminderCreateUpdateNav.action');
}
