/**
* Show/Hide Notification edit button based on User Authorization
* @param {IClientAPI} context
*/
import libCom from '../../Common/Library/CommonLibrary';

export default function EnableNotificationEdit(context) {
    return (libCom.getAppParam(context, 'USER_AUTHORIZATIONS', 'Enable.NO.Edit') === 'Y' || libCom.isCurrentReadLinkLocal(context.binding['@odata.readLink']));
}
