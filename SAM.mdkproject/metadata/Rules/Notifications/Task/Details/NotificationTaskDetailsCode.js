import notification from '../../NotificationLibrary';

export default function NotificationTaskDetailsCode(context) {
    try	{
        var code = context.binding.TaskCode;
        var codeGroup = context.binding.TaskCodeGroup;
        return notification.NotificationCodeStr(context, 'CatTypeTasks', codeGroup, code);
    } catch (exception)	{
        return context.localizeText('unknown');
    }
}
