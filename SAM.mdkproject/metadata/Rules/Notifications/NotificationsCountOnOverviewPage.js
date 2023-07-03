export default function NotificationsCountOnOverviewPage(sectionProxy, queryOptions='') {
    return sectionProxy.count('/SAPAssetManager/Services/AssetManager.service','MyNotificationHeaders', queryOptions).then((count) => {
        return count;
    });
}
