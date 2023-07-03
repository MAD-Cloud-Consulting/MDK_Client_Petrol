import libEval from '../../Common/Library/ValidationLibrary';

export default function ConfirmationCreateBlankReadLink(context) {
    var binding = context.binding;
    let navLinksArray = [];
    if (binding) {
        let data = binding;
        if (!libEval.evalIsEmpty(context.getClientData())) {
            data = context.getClientData();
        }

        let type;
        if (data.FinalConfirmationSubOperation) {
            type = 'suboperation';
        } else if (data.FinalConfirmationOperation) {
            type = 'operation';
        } else {
            type = 'workorder';
        }

        switch (type) {
            case 'workorder': {
                //Link confirmation to work order.
                navLinksArray.push({
                    'Property': 'WorkOrderHeader',
                    'Target': {
                        'EntitySet': 'MyWorkOrderHeaders',
                        'ReadLink': `MyWorkOrderHeaders(OrderId='${data.FinalConfirmationOrderID}')`,
                    },
                });
                break;
            }
            case 'operation': {
                //Link confirmation to operation.
                navLinksArray.push({
                    'Property': 'WorkOrderOperation',
                    'Target': {
                        'EntitySet': 'MyWorkOrderOperations',
                        'ReadLink': `MyWorkOrderOperations(OrderId='${data.FinalConfirmationOrderID}',OperationNo='${data.FinalConfirmationOperation}')`,
                    },
                });
                break;
            }
            case 'suboperation': {
                //Link confirmation to sub-operation.
                navLinksArray.push({
                    'Property': 'WorkOrderSubOperation',
                    'Target': {
                        'EntitySet': 'MyWorkOrderSubOperations',
                        'ReadLink': `MyWorkOrderSubOperations(OperationNo='${data.FinalConfirmationOperation}',OrderId='${data.FinalConfirmationOrderID}',SubOperationNo='${data.FinalConfirmationSubOperation}')`,
                    },
                });
                break;
            }
            default:
                break;
        }
    }
    return navLinksArray;
}
