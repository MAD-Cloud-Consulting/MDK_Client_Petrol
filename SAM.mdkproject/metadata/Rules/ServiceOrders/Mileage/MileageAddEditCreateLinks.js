import MileageAddEditOperationNo from './MileageAddEditOperationNo';
import MileageAddEditOrderId from './MileageAddEditOrderId';

export default function MileageAddEditCreateLinks(pageProxy) {

    let orderId = MileageAddEditOrderId(pageProxy);
    let operationNo = MileageAddEditOperationNo(pageProxy);
    let links = [];

    links.push({
        'Property': 'WorkOrderHeader',
        'Target':
        {
            'EntitySet': 'MyWorkOrderHeaders',
            'ReadLink': `MyWorkOrderHeaders('${orderId}')`,
        },
    });

    links.push({
        'Property': 'WorkOrderOperation',
        'Target': {
            'EntitySet': 'MyWorkOrderOperations',
            'ReadLink': `MyWorkOrderOperations(OrderId='${orderId}',OperationNo='${operationNo}')`,
        },
    });

    return links;
}
