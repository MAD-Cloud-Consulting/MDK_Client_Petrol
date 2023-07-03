import CommonLibrary from '../../Common/Library/CommonLibrary';
import woHistReadLink from './WorkOrderHistoryReadLink';
export default function WorkOrderHistoryPendingCount(sectionProxy) {
    let context = sectionProxy.getPageProxy();
    let historyReadLinkPath = woHistReadLink(context);
    return CommonLibrary.getEntitySetCount(sectionProxy.getPageProxy(), historyReadLinkPath, "$filter=ReferenceType eq 'P'");
}
