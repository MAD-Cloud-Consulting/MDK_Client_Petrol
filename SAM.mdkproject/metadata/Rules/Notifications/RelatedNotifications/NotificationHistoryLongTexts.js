import libCommon from '../../Common/Library/CommonLibrary';
import {ValueIfExists} from '../../Common/Library/Formatter';
export default function NotificationHistoryLongText(context) {
        let historyLongText = context.binding.HistoryLongText_Nav;
        if (libCommon.isDefined(historyLongText)) {
            return ValueIfExists(historyLongText.TextString);
        } else {
            return '-';
        }
}
