import NotificationHistReadlink from './NotificationHistoryReadLink';

export default function NotificationHistoryEntitySet(sectionProxy) {
    let context = sectionProxy.getPageProxy();
    return NotificationHistReadlink(context);
}
