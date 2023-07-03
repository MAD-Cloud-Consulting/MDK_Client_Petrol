import libCom from '../../Common/Library/CommonLibrary';

/**
 * Creates the navigation relationships for a new UserTimeEntry work order or operation record
 * @param {*} context
 */
export default function WorkOrderClockInCreateLinks(context) {
    let binding = libCom.getBindingObject(context);
    var links = [];

    if (binding.ClockType === 'WorkOrder') {
        links.push({
            'Property': 'WOHeader_Nav',
            'Target':
            {
                'EntitySet': 'MyWorkOrderHeaders',
                'ReadLink': "MyWorkOrderHeaders('" + binding.ClockOrderId + "')",
            },
        });
    } else if (binding.ClockType === 'Operation') {
        links.push({
            'Property': 'WOOperation_Nav',
            'Target':
            {
                'EntitySet': 'MyWorkOrderOperations',
                'ReadLink': "MyWorkOrderOperations(OrderId='" + binding.ClockOrderId + "',OperationNo='" + binding.ClockOperationNo + "')",
            },
        });
    }
    return links;
}
