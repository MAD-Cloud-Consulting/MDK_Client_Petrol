import CommonLibrary from '../../../Common/Library/CommonLibrary';

export default function NotificationItemTasksCount(clientAPI) {
    var readLink = clientAPI.getPageProxy().binding['@odata.readLink'];
    return CommonLibrary.getEntitySetCount(clientAPI, readLink + '/ItemCauses', '');
}
