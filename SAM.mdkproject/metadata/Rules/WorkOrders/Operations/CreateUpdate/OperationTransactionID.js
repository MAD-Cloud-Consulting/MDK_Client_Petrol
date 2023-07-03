import GenerateLocalID from '../../../Common/GenerateLocalID';
import libCommon from '../../../Common/Library/CommonLibrary';
import { OperationControlLibrary as libOperationControl} from '../WorkOrderOperationLibrary';

/**
 * Operation's TransactionID is parent workorder's OrderId
 * @param {*} context 
 */
export default function OperationTransactionID(context) {
    let onWoChangeset = libCommon.isOnWOChangeset(context);
    if (onWoChangeset) {
        return GenerateLocalID(context, 'MyWorkOrderHeaders', 'OrderId', '00000', "$filter=startswith(OrderId, 'LOCAL') eq true", 'LOCAL_W');
    } else {
        let onCreate = libCommon.IsOnCreate(context);
        if (onCreate) {
            /**
             * When comming from the operations list we might not have the parent orderId. In that case we need to get it from picker.
             */
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

        return libCommon.getEntityProperty(context, context.binding['@odata.readLink'] + '/WOHeader', 'OrderId');
    }
}
