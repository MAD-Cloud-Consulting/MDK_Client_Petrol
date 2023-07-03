import workorderCount from '../WorkOrders/WorkOrdersCount';
import getFSMQueryOption from '../WorkOrders/ListView/WorkOrdersFSMQueryOption';

export default function SideDrawerWorkOrdersCount(context) {
    return getFSMQueryOption(context).then(queryOptions => {
        let queryString = '$filter=' + queryOptions;
        return workorderCount(context, queryString).then(result => {
            return context.localizeText('service_order_x', [result]);
        });
    });
}
