import notification from '../NotificationLibrary';

export default function NotificationCauseDetailsGroup(context) {
    try	{
        var codeGroup = context.binding.CauseCodeGroup;
        return notification.NotificationCodeGroupStr(context, 'CatTypeCauses', codeGroup);
    } catch (exception)	{
        return context.localizeText('unknown');
    }
}
