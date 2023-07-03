/**
* On Value Change for Minor Work Switch
* @param {IClientAPI} context
*/
import libCommon from '../../Common/Library/CommonLibrary';

export default function NotificationCreateUpdateMinorWorkOnChange(context) {
    return context.getValue() === true ?  libCommon.setStateVariable(context, 'isMinorWork', true) : libCommon.setStateVariable(context, 'isMinorWork', false);
}
