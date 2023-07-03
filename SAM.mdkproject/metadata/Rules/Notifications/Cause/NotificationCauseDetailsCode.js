import notification from '../NotificationLibrary';

export default function NotificationCauseDetailsCode(context) {
    try	{
        var code = context.binding.CauseCode;
        var codeGroup = context.binding.CauseCodeGroup;
        return notification.NotificationCodeStr(context, 'CatTypeCauses', codeGroup, code);
    } catch (exception)	{
        return 'Unknown';
    }
}
