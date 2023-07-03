import {WorkOrderLibrary as libWo} from '../WorkOrders/WorkOrderLibrary';
import libCom from '../Common/Library/CommonLibrary';
import notificationNavQuery from '../Notifications/NotificationsListViewQueryOption';

export default function PushNotificationsViewEntityNav(context) {
    var binding = libCom.getClientDataForPage(context);
    let entity = '';
    let queryOptions = '';
    let navigateAction = '';
    if (binding.ObjectType === 'WorkOrder') {
        entity =  'MyWorkOrderHeaders('+ '\'' + binding.TitleLocArgs +'\''+')';
        queryOptions = libWo.getWorkOrderDetailsNavQueryOption(context);
        navigateAction = '/SAPAssetManager/Actions/WorkOrders/WorkOrderDetailsNav.action';
    } else if (binding.ObjectType === 'Notification') {
        entity =  'MyNotificationHeaders('+ '\'' + binding.TitleLocArgs +'\''+')';
        queryOptions =  notificationNavQuery(context);
        navigateAction = '/SAPAssetManager/Actions/Notifications/NotificationDetailsNav.action';
    } 
    return context.read('/SAPAssetManager/Services/AssetManager.service', entity, [], queryOptions).then((result) => {
        if (result && result.getItem(0)) {
            context.setActionBinding(result.getItem(0));
            return context.executeAction(navigateAction);
        }
        return '';
    });
      
       
}
