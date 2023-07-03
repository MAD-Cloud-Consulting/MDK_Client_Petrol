import CommonLibrary from '../Common/Library/CommonLibrary';
import WorkOrderDetailsNavQueryOptions from './Details/WorkOrderDetailsNavQueryOptions';

export default function FollowOnWorkOrdersCount(context) {
    if (CommonLibrary.isDefined(context.getPageProxy().binding) && CommonLibrary.isDefined(context.getPageProxy().binding['@odata.type'])) {
        if (context.getPageProxy().binding['@odata.type'] === '#sap_mobile.MyWorkOrderHeader') {
            let reference = context.getPageProxy().binding.OrderId; 
            return CommonLibrary.getEntitySetCount(context, 'MyWorkOrderHeaders', `$filter=ReferenceOrder eq '${reference}'&`+ WorkOrderDetailsNavQueryOptions() + '&$orderby=Priority,DueDate,OrderId,WODocuments/DocumentID,OrderMobileStatus_Nav/MobileStatus').then(count => {
                if (count) {
                    context.getPageProxy().getClientData().Count= count;
                    return count;
                } else {
                    context.getPageProxy().getClientData().Count= 0;
                    return 0;
                }
            });
        } else {
            return 0;
        }
    } else {
        return CommonLibrary.getEntitySetCount(context, 'MyWorkOrderHeaders', '').then(count => {
            if (count) {
                context.getPageProxy().getClientData().Count= count;
                return count;
            } else {
                context.getPageProxy().getClientData().Count= 0;
                return 0;
            }
        });
    }
}
