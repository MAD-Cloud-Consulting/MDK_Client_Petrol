import notification from '../../NotificationLibrary';

export default function NotificationItemDetailsPart(context) {
    try	{
        var objectPartCodeGroup = context.binding.ObjectPartCodeGroup;
        var objectPart = context.binding.ObjectPart;
        return notification.NotificationCodeStr(context, 'CatTypeObjectParts', objectPartCodeGroup, objectPart);
    } catch (exception)	{
        return context.localizeText('unknown');
    }
}
