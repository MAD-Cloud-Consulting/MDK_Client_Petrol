import isAndroid from '../Common/IsAndroid';
import libCommon from '../Common/Library/CommonLibrary';

export default function ReminderSaveText(context) {
    if (isAndroid(context)) {
        if (libCommon.IsOnCreate(context)) {
            return context.localizeText('save');
        } else {
            return context.localizeText('apply');
        }
    } else {
        return context.localizeText('done');
    }
}
