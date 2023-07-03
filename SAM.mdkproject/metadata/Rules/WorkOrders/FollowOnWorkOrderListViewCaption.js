import CommonLibrary from '../Common/Library/CommonLibrary';
import WorkOrderDetailsNavQueryOptions from './Details/WorkOrderDetailsNavQueryOptions';

export default function FollowOnWorkOrderListViewCaption(context) {
    let reference = context.getPageProxy().binding.OrderId; 
    return CommonLibrary.getEntitySetCount(context, 'MyWorkOrderHeaders', `$filter=ReferenceOrder eq '${reference}'&`+ WorkOrderDetailsNavQueryOptions() + '&$orderby=Priority,DueDate,OrderId,WODocuments/DocumentID,OrderMobileStatus_Nav/MobileStatus').then(count => {
        context.getPageProxy().getClientData().Count= count;
        return  `Work Orders (${count})`;
    });
}
