import reminderCount from '../OverviewPage/OverviewPageRemindersCount';
export default function RemindersCaption(context) {
    return reminderCount(context).then(count => {
        let params=[count];
        return context.setCaption(context.localizeText('reminders_x',params));
    });
}
