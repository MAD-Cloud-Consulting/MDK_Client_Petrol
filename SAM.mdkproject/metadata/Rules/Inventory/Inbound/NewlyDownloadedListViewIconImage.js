import isAndroid from '../../Common/IsAndroid';
import libCom from '../../Common/Library/CommonLibrary';

export default function NewlyDownloadedListViewIconImages(context) {
    var iconImage = [];
    let isLocal = libCom.isCurrentReadLinkLocal(context.binding['@odata.readLink']);

    if (isLocal) {
        iconImage.push(isAndroid(context) ? '/SAPAssetManager/Images/syncOnListIcon.android.png' : '/SAPAssetManager/Images/syncOnListIcon.png');
    }

    return iconImage;
}
