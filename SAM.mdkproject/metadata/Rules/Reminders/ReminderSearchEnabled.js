import reminderCount from '../OverviewPage/OverviewPageRemindersCount';
export default function ReminderSearchEnabled(context) {
    return reminderCount(context).then(count => {
        return count !== 0;
    });
}
