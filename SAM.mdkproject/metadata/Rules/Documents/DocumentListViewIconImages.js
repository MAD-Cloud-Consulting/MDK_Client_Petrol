import ComLib from '../Common/Library/CommonLibrary';
import isAndroid from '../Common/IsAndroid';

export default function DocumentListViewIconImages(controlProxy) {
    const readLink = controlProxy.binding['@odata.readLink'];
    if (ComLib.isCurrentReadLinkLocal(readLink)) {
        return [isAndroid(controlProxy) ? '/SAPAssetManager/Images/syncOnListIcon.android.png' : '/SAPAssetManager/Images/syncOnListIcon.png'];
    } else {
        return [];
    }
}
