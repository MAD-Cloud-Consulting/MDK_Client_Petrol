import libCommon from '../Common/Library/CommonLibrary';
import libPart from './PartLibrary';
import isAndroid from '../Common/IsAndroid';

export default function PartsItemIconImages(context) {
    
    // check if this Part has been locally created


    if (libCommon.getTargetPathValue(context,'#Property:@sap.isLocal')) {
        return [isAndroid(context) ? '/SAPAssetManager/Images/syncOnListIcon.android.png' : '/SAPAssetManager/Images/syncOnListIcon.png'];
    } else {
        return libPart.getLocalQuantityIssued(context, context.binding).then(result => {
            if (result !== 0) {
                return [isAndroid(context) ? '/SAPAssetManager/Images/syncOnListIcon.android.png' : '/SAPAssetManager/Images/syncOnListIcon.png'];
            } else {
                return [];
            }
        }).catch(() => {
            return [];
        });  
    }
}
