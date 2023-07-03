/**
* Get Push Pending State
* @param {IClientAPI} context
*/
import libComm from '../Common/Library/CommonLibrary';

export default function GetPushNotificationsPendingState(context) {
    return libComm.getStateVariable(context, 'PushPending');
}
