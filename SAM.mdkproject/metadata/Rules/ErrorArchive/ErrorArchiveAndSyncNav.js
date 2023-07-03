/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function ErrorArchiveAndSyncNav(context) {
    context.getPageProxy().getClientData().SlideOutMenu = false;
    return context.executeAction('/SAPAssetManager/Actions/ErrorArchive/ErrorArchiveAndSync.action');
}
