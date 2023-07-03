import WorkOrdersListViewQueryOption from '../WorkOrders/ListView/WorkOrdersListViewQueryOption';
import WorkOrderOperationsListViewQueryOption from '../WorkOrders/Operations/WorkOrderOperationsListViewQueryOption';
import SubOperationsListViewQueryOption from '../SubOperations/SubOperationsListViewQueryOption';
import NotificationTasksListViewQueryOption from '../Notifications/Task/NotificationTasksListViewQueryOption';
import NotificationItemTasksListViewQueryOption from '../Notifications/Item/Task/NotificationItemTasksListViewQueryOption';
import BusinessPartnerQueryOptions from '../BusinessPartners/BusinessPartnerQueryOptions';
import NotificationDetailsNavQueryOptions from '../Notifications/Details/NotificationDetailsNavQueryOptions';

export default function GetDetailsNavQueryOption(context, entityODataType) {
    let entity = '';
    if (entityODataType) {
        entity = entityODataType.substring(0, entityODataType.indexOf('('));
    }
    switch (entity) {
        case 'MyWorkOrderHeaders':
            return WorkOrdersListViewQueryOption(context);
        case 'MyWorkOrderOperations':
            return WorkOrderOperationsListViewQueryOption(context);
        case 'MyWorkOrderSubOperations':
            return SubOperationsListViewQueryOption(context);
        case 'MyNotificationHeaders':
            return NotificationDetailsNavQueryOptions(context);
        case 'MyNotificationItems':
            // there is nothing to expand for Notification Item
            return '';
        case 'MyNotificationTasks':
            return NotificationTasksListViewQueryOption();
        case 'MyNotificationActivities':
            return '';
        case 'MyNotificationItemCauses':
            return '';
        case 'MyNotificationItemTasks':
            return NotificationItemTasksListViewQueryOption();
        case 'MyNotificationItemActivities':
            return '';
        case 'Addresses':
        case 'Employees':
            return BusinessPartnerQueryOptions();
        default:
            return '';
    }
}
