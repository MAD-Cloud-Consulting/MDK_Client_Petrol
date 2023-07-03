import libCommon from '../Common/Library/CommonLibrary';
import isAndroid from '../Common/IsAndroid';

export default function RemindersIconImages(context) {
    if (libCommon.getTargetPathValue(context,'#Property:@sap.isLocal')) {
        return [isAndroid(context) ? '/SAPAssetManager/Images/syncOnListIcon.android.png' : '/SAPAssetManager/Images/syncOnListIcon.png'];
    } else {
        return [];
    }
}
