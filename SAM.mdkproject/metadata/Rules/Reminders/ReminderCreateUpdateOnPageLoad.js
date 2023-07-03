import { Reminder as libRem } from '../UserPreferences/UserPreferencesLibrary';
import style from '../Common/Style/StyleFormCellButton';
import libCom from '../Common/Library/CommonLibrary';

export default function ReminderCreateUpdateOnPageLoad(context) {
    libRem.reminderCreateUpdateOnPageLoad(context);
    style(context, 'DiscardButton');
    libCom.saveInitialValues(context);
}
