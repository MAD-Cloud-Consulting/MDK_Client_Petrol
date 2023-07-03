import commonLib from '../../../Common/Library/CommonLibrary';

export default function CreateLinks(context) {
    let operation = commonLib.getListPickerValue(commonLib.getTargetPathValue(context, '#Control:OperationLstPkr/#Value'));
    let workOrder = commonLib.getListPickerValue(commonLib.getTargetPathValue(context, '#Control:WorkOrderLstPkr/#Value'));

    let links = [{
        'Property': 'WorkOrderHeader',
        'Target':
        {
            'EntitySet': 'MyWorkOrderHeaders',
            'ReadLink': `MyWorkOrderHeaders('${workOrder}')`,
        },
    },
    {
        'Property': 'WorkOrderOperation',
        'Target': {
            'EntitySet': 'MyWorkOrderOperations',
            'ReadLink': `MyWorkOrderOperations(OrderId='${workOrder}',OperationNo='${operation}')`,
        },
    }];

    return links;
}
