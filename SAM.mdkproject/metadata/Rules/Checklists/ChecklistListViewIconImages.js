import libCommon from '../Common/Library/CommonLibrary';
import isAndroid from '../Common/IsAndroid';

export default function ChecklistListViewIconImages(context) {

    var iconImage = [];

    // check if this checklist requires sync
    if (libCommon.getTargetPathValue(context, '#Property:@sap.isLocal') || libCommon.getTargetPathValue(context, '#Property:MobileStatus/#Property:@sap.isLocal') || libCommon.getTargetPathValue(context, '#Property:HeaderLongText/#Property:0/#Property:@sap.isLocal')) {
        if (isAndroid(context)) {
            iconImage.push('/SAPAssetManager/Images/syncOnListIcon.android.png');
        } else {
            iconImage.push('/SAPAssetManager/Images/syncOnListIcon.png');
        }
    }

    return iconImage;
}
