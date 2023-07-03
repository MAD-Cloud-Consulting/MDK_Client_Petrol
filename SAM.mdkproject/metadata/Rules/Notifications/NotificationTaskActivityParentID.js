import common from '../Common/Library/CommonLibrary';

export default function NotificationTaskActivityParentID(context) {
    return common.getEntityProperty(context, context.binding['@odata.readLink'] + '/Notification', 'NotificationNumber');
}
