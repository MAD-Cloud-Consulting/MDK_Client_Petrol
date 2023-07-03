import commonLib from '../Common/Library/CommonLibrary';

export default function ReminderCreateUpdateDeleteIsEnabled(clientAPI) {
    let onCreate = commonLib.IsOnCreate(clientAPI);
    if (onCreate) {
        return false;
    } else
        return true;
}
