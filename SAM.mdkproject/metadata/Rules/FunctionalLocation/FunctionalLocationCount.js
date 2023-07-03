import CommonLibrary from '../Common/Library/CommonLibrary';
export default function FunctionalLocationCount(context) {
if (CommonLibrary.isDefined(context.getPageProxy().binding) && CommonLibrary.isDefined(context.getPageProxy().binding['@odata.type'])) {
        if (context.getPageProxy().binding['@odata.type'] === '#sap_mobile.MyWorkOrderHeader') {
            return CommonLibrary.getEntitySetCount(context, 'MyFunctionalLocations', `$filter=WorkOrderHeader/any( wo: wo/OrderId eq '${context.getPageProxy().binding.OrderId}' ) or WorkOrderOperation/WOHeader/any(wo: wo/OrderId eq '${context.getPageProxy().binding.OrderId}' ) or WorkOrderSubOperation/WorkOrderOperation/WOHeader/any( wo: wo/OrderId eq '${context.getPageProxy().binding.OrderId}' )`).then(count => {
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
        return CommonLibrary.getEntitySetCount(context, 'MyFunctionalLocations', '').then(count => {
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
