import commonLibrary from '../Common/Library/CommonLibrary';

export default function MobileStatusEAMObjectType(context) {
    var mobileStatusEAMObjectType = '';
    var binding = commonLibrary.getBindingObject(context);
    if (binding) {
        switch (binding['@odata.type']) {
            case '#sap_mobile.MyWorkOrderHeader':
                mobileStatusEAMObjectType = 'WORKORDER';
                break;
            case '#sap_mobile.MyWorkOrderOperation': 
            case '#sap_mobile.MyWorkOrderSubOperation':
                mobileStatusEAMObjectType = 'WO_OPERATION';
                break;
            case '#sap_mobile.MyNotificationTask':
            case '#sap_mobile.MyNotificationItemTask':
                mobileStatusEAMObjectType = 'TASK';
                break;
            case '#sap_mobile.MyNotificationHeader':
                mobileStatusEAMObjectType = 'NOTIFICATION';
                break;
            default:
                break;
        }
    }
    return mobileStatusEAMObjectType;
}
