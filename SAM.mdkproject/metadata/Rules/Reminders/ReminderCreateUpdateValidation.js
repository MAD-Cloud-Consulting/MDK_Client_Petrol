import { Reminder as remLib } from '../UserPreferences/UserPreferencesLibrary';

/**
 * Runs validation rules for reminder create and update screen.
 *
 * @param {*} context The context from which this rule is running from.
 * @returns {Boolean} Returns true if validation succeeded, or False if failed.
 */
export default function ReminderCreateUpdateValidation(context) {

    if (!context) {
        throw new TypeError('Context can\'t be null or undefined');
    }

    return remLib.reminderCreateUpdateValidation(context);
}
