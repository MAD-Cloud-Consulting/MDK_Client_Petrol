import { GlobalVar } from '../Common/Library/GlobalCommon';

export default function MobileStatusObjectType(context) {
    var mobileStatusObjectType = '';
    var binding = context.binding;
    if (binding) {
        switch (binding['@odata.type']) {
            case '#sap_mobile.MyWorkOrderHeader': {
                mobileStatusObjectType = GlobalVar.getAppParam().OBJECTTYPE.WorkOrder;
                break;
            }
            case '#sap_mobile.MyWorkOrderOperation': {
                mobileStatusObjectType = GlobalVar.getAppParam().OBJECTTYPE.Operation;
                break;
            }
            case '#sap_mobile.MyWorkOrderSubOperation': {
                mobileStatusObjectType = GlobalVar.getAppParam().OBJECTTYPE.SubOperation;
                break;
            }
            case '#sap_mobile.MyNotificationHeader': {
                mobileStatusObjectType = GlobalVar.getAppParam().OBJECTTYPE.Notification;
                break;
            }
            default:
                break;
        }
    }
    return mobileStatusObjectType;
}
