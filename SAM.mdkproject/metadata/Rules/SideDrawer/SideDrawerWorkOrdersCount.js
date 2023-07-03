import workorderCount from '../WorkOrders/WorkOrdersCount';

export default function SideDrawerWorkOrdersCount(context) {
    return workorderCount(context).then(result => {
        return context.localizeText('work_order_x', [result]);
    });
}
