import notification from '../../NotificationLibrary';

export default function NotificationItemDetailsDamage(context) {
    try	{
        var codeGroup = context.binding.CodeGroup;
        var code = context.binding.DamageCode;
        return notification.NotificationCodeStr(context, 'CatTypeDefects', codeGroup, code);
    } catch (exception)	{
        return context.localizeText('unknown');
    }
}
