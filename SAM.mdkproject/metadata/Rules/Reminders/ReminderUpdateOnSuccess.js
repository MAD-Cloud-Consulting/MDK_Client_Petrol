import { Reminder as remLib } from '../UserPreferences/UserPreferencesLibrary';
import ExecuteActionWithAutoSync from '../ApplicationEvents/AutoSync/ExecuteActionWithAutoSync';

/**
 * Updates the fields on reminder detail page to reflect the changed values from ReminderUpdate.action.
 * Shows update entity toast message next. 
 * @param {*} context The context proxy depending on where this rule is being called from.
 */
export default function ReminderUpdateOnSuccess(context) {
    if (!context) {
        throw new TypeError('Context can\'t be null or undefined');
    }
    remLib.reminderDetailPageRedraw(context);
    return ExecuteActionWithAutoSync(context, '/SAPAssetManager/Actions/CreateUpdateDelete/UpdateEntitySuccessMessage.action');
}
