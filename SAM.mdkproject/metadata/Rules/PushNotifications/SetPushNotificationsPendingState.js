/**
* Set Push Pending State
* @param {IClientAPI} context
*/
import libComm from '../Common/Library/CommonLibrary';

export default function SetPushNotificationsPendingState(context, flag) {
    return libComm.setStateVariable(context, 'PushPending', flag);
}
