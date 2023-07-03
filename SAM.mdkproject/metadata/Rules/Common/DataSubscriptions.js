
import libCom from '../Common/Library/CommonLibrary';
export default function DataSubscriptions(context) {
    let pageName = libCom.getPageName(context);
    let defaultDataSubs = [];
    switch (pageName) {
        case 'NotificationsListViewPage':
            return [
                'MyWorkOrderHeaders',
                'MyNotificationHeaders',
                'UserPreferences',
                'MyEquipments',
                'PMMobileStatuses',
                'CatsTimesheetOverviewRows',
                'ConfirmationOverviewRows',
                '/SAPAssetManager/Services/AssetManager.service',
            ];
        case 'OverviewPage':
            return [
                'MyWorkOrderSubOperations',
                'MyWorkOrderHeaders',
                'MyNotificationHeaders',
                'MyWorkOrderOperations',
                'UserPreferences',
                'MyEquipments',
                'UserFeatures',
                '/SAPAssetManager/Services/AssetManager.service',
            ];
        case 'SideMenuDrawer':
            return [
                'MyWorkOrderSubOperations',
                'MyWorkOrderHeaders',
                'MyNotificationHeaders',
                'MyWorkOrderOperations',
                'UserPreferences',
                'MyEquipments',
                'ErrorArchive',
                'UserFeatures',
                'Confirmations',
                '/SAPAssetManager/Services/AssetManager.service',
            ];
        case 'WorkOrdersListViewPage':
            return [
                'PMMobileStatuses', 
                'MyWorkOrderHeaderLongTexts',
                'UserTimeEntries',
                '/SAPAssetManager/Services/AssetManager.service',
            ];
        case 'MeterDetailsPage', 'PeriodicMeterDetailsPage':
            if (context.binding.ISUProcess !== 'INSTALL') {
                defaultDataSubs.push('Devices', 'DeviceGoodsMovements');
            }
            defaultDataSubs.push('MeterReadings');
            return defaultDataSubs;
        default:
            return defaultDataSubs;
        }
}
