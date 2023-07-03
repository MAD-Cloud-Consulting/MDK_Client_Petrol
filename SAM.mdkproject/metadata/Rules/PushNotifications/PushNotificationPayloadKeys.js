
import isAndroid from '../Common/IsAndroid';
import libCom from '../Common/Library/CommonLibrary';

export default function PushNotificationPayloadKeys(context, key) {
    let isAndroidPushFromBackground = libCom.getStateVariable(context,'AndroidBackgroundPush');

    if (isAndroid(context) && !isAndroidPushFromBackground) {
        switch (key) {
            case 'localizedBody':
                return 'bodyLocKey';
            case 'localizedTitle':
                return 'titleLocKey';
            case 'localizeTitleArguments':
                return 'titleLocArgs';
            case 'localizedBodyArguments':
                return 'bodyLocArgs';
            default:
                break;
        }
    } else {
        switch (key) {
            case 'localizedBody':
                return 'loc-key';
            case 'localizedTitle':
                return 'title-loc-key';
            case 'localizeTitleArguments':
                return 'title-loc-args';
            case 'localizedBodyArguments':
                return 'loc-args';
            default:
                break;
        }
    }
}
