import isAndroid from '../Common/IsAndroid';
import libCommon from '../Common/Library/CommonLibrary';

export default function ExpensesIcons(controlProxy) {
    const readLink = controlProxy.binding['@odata.readLink'];
    if (libCommon.isCurrentReadLinkLocal(readLink)) {
        let icon = isAndroid(controlProxy) ? '/SAPAssetManager/Images/syncOnListIcon.android.png' : 
            '/SAPAssetManager/Images/syncOnListIcon.png';
        return [icon];
    } else {
        return [];
    }
}
