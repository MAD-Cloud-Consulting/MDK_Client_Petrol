import DocLib from '../DocumentLibrary';
import commonLib from '../../Common/Library/CommonLibrary';

export default function DocumentCreateObjectLink(controlProxy) {
    let binding = controlProxy.binding;
    if (binding['@odata.type'] === '#sap_mobile.MyNotificationHeader' && commonLib.getStateVariable(controlProxy, 'NotificationCategory')) {
        let value = commonLib.getAppParam(controlProxy,'DOCUMENT',commonLib.getStateVariable(controlProxy, 'NotificationCategory'));
        return value ? value : '';
    } else {
        return DocLib.getObjectLink(controlProxy);
    }
}
