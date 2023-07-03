import isAndroid from '../IsAndroid';
import libCommon from '../Library/CommonLibrary';

export default function DoneText(context) {
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
