import libCommon from '../../Common/Library/CommonLibrary';
import isAndroid from '../../Common/IsAndroid';

export default function InspectionLotIcons(context) {
    var iconImage = [];

    // check if this checlist requires sync
    if (libCommon.getTargetPathValue(context, '#Property:@sap.isLocal')) {
        iconImage.push(isAndroid(context) ? '/SAPAssetManager/Images/syncOnListIcon.android.png' : '/SAPAssetManager/Images/syncOnListIcon.png');
    }
    if (iconImage.length === 0 && libCommon.getTargetPathValue(context, '#Property:InspectionLot_Nav/#Property:@sap.isLocal')) {
        iconImage.push(isAndroid(context) ? '/SAPAssetManager/Images/syncOnListIcon.android.png' : '/SAPAssetManager/Images/syncOnListIcon.png');
    }
    if (iconImage.length === 0) {
        return context.count('/SAPAssetManager/Services/AssetManager.service', `${context.binding['@odata.readLink']}/InspectionChar_Nav`, '$filter=sap.islocal()').then(count => {
            if (count > 0) {
                iconImage.push(isAndroid(context) ? '/SAPAssetManager/Images/syncOnListIcon.android.png' : '/SAPAssetManager/Images/syncOnListIcon.png');
            }
            return iconImage;
        });
    }
    return iconImage;
}
