import CommonLibrary from '../Common/Library/CommonLibrary';
import WOHistReadlink from '../WorkOrders/History/WorkOrderHistoryReadLink';

export default function FLOCWORelatedHistoriesCount(sectionProxy) {
    let entity = sectionProxy.getPageProxy();
    let orderReadLink = WOHistReadlink(entity);
    return CommonLibrary.getEntitySetCount(sectionProxy,orderReadLink, '');
}
