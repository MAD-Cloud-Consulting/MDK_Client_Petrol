import libCommon from '../Common/Library/CommonLibrary';

export default function NotificationObjectType(context) {
    return libCommon.getAppParam(context,'OBJECTTYPE','Notification');
}
