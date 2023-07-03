import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function NotificationItemsCount(clientAPI) {
    var readLink = clientAPI.getPageProxy().binding['@odata.readLink'];
    return CommonLibrary.getEntitySetCount(clientAPI, readLink + '/Items', '');
}
