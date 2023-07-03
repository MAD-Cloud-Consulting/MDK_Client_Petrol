import libCommon from '../../../Common/Library/CommonLibrary';
import isAndroid from '../../../Common/IsAndroid';

export default function PRTEquipmentsListIconImages(context) {
    var iconImage = [];

    // check if this order requires sync
    if (libCommon.getTargetPathValue(context, '#Property:@sap.isLocal')) {
        iconImage.push(isAndroid(context) ? '/SAPAssetManager/Images/syncOnListIcon.android.png' : '/SAPAssetManager/Images/syncOnListIcon.png');
    }

    return iconImage;
}
