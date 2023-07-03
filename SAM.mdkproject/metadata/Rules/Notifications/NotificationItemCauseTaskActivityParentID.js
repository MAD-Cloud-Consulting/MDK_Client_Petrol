import common from '../Common/Library/CommonLibrary';

export default function NotificationItemCauseTaskActivityParentID(context) {
    return common.getEntityProperty(context, context.binding['@odata.readLink'] + '/Item/Notification', 'NotificationNumber');
}
