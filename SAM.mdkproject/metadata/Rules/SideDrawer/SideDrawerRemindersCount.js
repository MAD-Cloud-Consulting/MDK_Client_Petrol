import count from '../OverviewPage/OverviewPageRemindersCount';

export default function SideDrawerRemindersCount(context) {
    return count(context).then(result => {
        return context.localizeText('reminders_x', [result]);
    });
}
