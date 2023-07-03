import libWOMobile from './WorkOrderMobileStatusLibrary';
import libMobile from '../../MobileStatus/MobileStatusLibrary';

export default function WorkOrderHoldStatus(context) {
    var isStatusChangeable = libMobile.isHeaderStatusChangeable(context);
    if (isStatusChangeable) {
        return libWOMobile.holdWorkOrder(context);
    }
    return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/WorkOrderMobileStatusFailureMessage.action');
}
