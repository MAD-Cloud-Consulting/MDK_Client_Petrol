import libCommon from '../Common/Library/CommonLibrary';

export default function ReminderPreferenceName(clientAPI) {

    if (libCommon.IsOnCreate(clientAPI)) {
        return '';

    } else {
        return clientAPI.binding.PreferenceName;
    }
}
