/**
* Show/Hide Notification create button based on User Authorization
* @param {IClientAPI} context
*/
import libCom from '../../Common/Library/CommonLibrary';

export default function EnableNotificationCreate(context) {
    return  (libCom.getAppParam(context, 'USER_AUTHORIZATIONS', 'Enable.NO.Create') === 'Y');
}
