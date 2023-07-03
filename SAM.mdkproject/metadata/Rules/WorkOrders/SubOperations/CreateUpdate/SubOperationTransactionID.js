import libCommon from '../../../Common/Library/CommonLibrary';
import { SubOperationControlLibrary as libOperationControl} from '../../../SubOperations/SubOperationLibrary';

/**
 * Operation's TransactionID is parent workorder's OrderId
 * @param {*} context 
 */
export default function SubOperationTransactionID(context) {
    let onCreate = libCommon.IsOnCreate(context);

    if (onCreate) {
        if (libCommon.isDefined(context.binding.OrderId)) {
            return context.binding.OrderId;
        } else {
            if (libCommon.isDefined(libOperationControl.getWorkOrder(context))) {
                return context.read('/SAPAssetManager/Services/AssetManager.service',libOperationControl.getWorkOrder(context), [], '').then(function(result) {
                    if (result && result.getItem(0)) {
                        return result.getItem(0).OrderId;
                    } else {
                        return '';
                    }
                });
            }
        }
    } 
    return libCommon.getEntityProperty(context, context.binding['@odata.readLink'] + '/WorkOrderOperation/WOHeader', 'OrderId');
}
