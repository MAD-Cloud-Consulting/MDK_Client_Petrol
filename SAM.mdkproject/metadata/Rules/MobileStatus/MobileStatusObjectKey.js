/**
 *
 * @param {*} context
 */
export default function MobileStatusObjectKey(context) {
    //The business object - Work Order, Operation, Notification, etc.
    let binding = context.binding;
    //If not a local object, it will have an ObjectKey value
    if (binding.ObjectKey) {
        return binding.ObjectKey;
    } else {
        //This is a local object.
        switch (binding['@odata.type']) {
            case '#sap_mobile.MyWorkOrderHeader': {
                if (binding.OrderMobileStatus_Nav.ObjectKey) {
                    return binding.OrderMobileStatus_Nav.ObjectKey;
                }
                break;
            }
            case '#sap_mobile.MyWorkOrderOperation': {
                if (binding.OperationMobileStatus_Nav.ObjectKey) {
                    return binding.OperationMobileStatus_Nav.ObjectKey;
                }
                break;
            }
            case '#sap_mobile.MyWorkOrderSubOperation': {
                if (binding.SubOpMobileStatus_Nav.ObjectKey) {
                    return binding.SubOpMobileStatus_Nav.ObjectKey;
                }
                break;
            }
            case '#sap_mobile.MyNotificationHeader': {
                if (binding.NotifMobileStatus_Nav.ObjectKey) {
                    return binding.NotifMobileStatus_Nav.ObjectKey;
                }
                break;
            }
            default:
                break;
        }
    }
    return '';
}

