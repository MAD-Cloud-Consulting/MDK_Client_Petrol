import libcomm from '../Common/Library/CommonLibrary';
import IsCompleteAction from '../WorkOrders/Complete/IsCompleteAction';

export default function TOTPCancelIsVisible(context) {
    if (libcomm.isInitialSync(context)) {
        return true;
    } else {
        if (IsCompleteAction(context)) {
            return false;
        } 

        if (libcomm.isDefined(context.binding) && libcomm.isDefined(context.binding['@odata.type'])) {
            switch (context.binding['@odata.type']) {
                case '#sap_mobile.MyWorkOrderHeader': {
                    return true;
                }
                case '#sap_mobile.MyWorkOrderOperation': {
                    return true;
                }
                case '#sap_mobile.MyNotificationHeader': {
                    return true;
                }
                default:
                    return false;
            }
        } else {
            return false;
        }
    }

}
