import libCommon from '../Common/Library/CommonLibrary';

export default function ReminderPreferenceValue(clientAPI) {

    if (libCommon.IsOnCreate(clientAPI)) {
        return '';

    } else {
        return clientAPI.binding.PreferenceValue;
    }
}
