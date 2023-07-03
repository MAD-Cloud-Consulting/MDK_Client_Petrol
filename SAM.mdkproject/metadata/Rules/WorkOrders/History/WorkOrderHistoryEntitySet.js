import WOHistReadlink from './WorkOrderHistoryReadLink';

export default function WorkOrderRelatedHistoryEntitySet(sectionProxy) {
    let context = sectionProxy.getPageProxy();
    return WOHistReadlink(context);
}
