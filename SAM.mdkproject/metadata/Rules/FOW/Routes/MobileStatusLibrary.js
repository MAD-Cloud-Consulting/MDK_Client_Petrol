import libCommon from '../../Common/Library/CommonLibrary';
import validation from '../../Common/Library/ValidationLibrary';
export default class {

    static mobileStatus(context, binding) {
        let currentReadLink = libCommon.getTargetPathValue(context, '#Property:@odata.readLink');
        let isLocal = libCommon.isCurrentReadLinkLocal(currentReadLink);
        var status = '';
        if (!isLocal) {
            if (!validation.evalIsEmpty(context.binding.WorkOrder)) {
                if (binding && binding.WorkOrder && binding.WorkOrder.OrderMobileStatus_Nav.MobileStatus) {
                    status = binding.WorkOrder.OrderMobileStatus_Nav.MobileStatus;
                } else if (binding && binding.Operation && binding.Operation.OperationMobileStatus_Nav.MobileStatus) {
                    status = binding.Operation.OperationMobileStatus_Nav.MobileStatus;
                }
            }
        }
        return validation.evalIsEmpty(status) ? '-' : context.localizeText(status);
    }
}

