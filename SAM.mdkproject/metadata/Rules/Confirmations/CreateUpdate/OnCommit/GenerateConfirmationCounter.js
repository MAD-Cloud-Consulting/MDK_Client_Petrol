

import QueryBuilder from '../../../Common/Query/QueryBuilder';
import GenerateLocalID from '../../../Common/GenerateLocalID';
import libCommon from '../../../Common/Library/CommonLibrary';

export default function GenerateConfirmationCounter(context) {
    let binding = libCommon.getBindingObject(context) || context.binding;

    // Required if we used a context menu
    if (context.getClientData().currentObject) {
        binding = context.getClientData().currentObject;
    }

    let queryBuilder = new QueryBuilder();
    if (binding.OrderId) {
        queryBuilder.addFilter(`OrderID eq '${binding.OrderId}'`);
    } else {
        queryBuilder.addFilter(`OrderID eq '${binding.OrderID}'`);
    }

    if (binding.OperationNo) {
        queryBuilder.addFilter(`Operation eq '${binding.OperationNo}'`);
    } else {
        queryBuilder.addFilter(`Operation eq '${binding.Operation}'`);
    }

    if (binding.SubOperationNo) {
        queryBuilder.addFilter('SubOperation eq \'' + binding.SubOperationNo + '\'');
    } else if (binding.SubOperation) {
        queryBuilder.addFilter('SubOperation eq \'' + binding.SubOperation + '\'');
    }

    return GenerateLocalID(context, 'Confirmations', 'ConfirmationCounter', '00000000', queryBuilder.build(),'', 'ConfirmationCounter');

}

