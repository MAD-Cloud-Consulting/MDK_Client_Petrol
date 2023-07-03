import workorderCount from './WorkOrdersCount';

export default function WorkOrdersSearchEnabled(context) {
    return workorderCount(context).then(count => {
        return count !== 0;
    });
}
