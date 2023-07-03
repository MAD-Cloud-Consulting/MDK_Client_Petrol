import libCommon from '../Common/Library/CommonLibrary';
import getUnifiedKey from './PushNotificationPayloadKeys';

export default function PushNotificationsStateVariables(context, unifiedPayload) {
        libCommon.setStateVariable(context,'TitleLocKey',unifiedPayload[getUnifiedKey(context, 'localizedTitle')]);
        libCommon.setStateVariable(context,'TitleLocArgs',unifiedPayload[getUnifiedKey(context, 'localizeTitleArguments')][0]);
        libCommon.setStateVariable(context,'BodyLocKey',unifiedPayload[getUnifiedKey(context, 'localizedBody')]);
        libCommon.setStateVariable(context,'BodyLocArgs',unifiedPayload[getUnifiedKey(context, 'localizedBodyArguments')][0]);
}
