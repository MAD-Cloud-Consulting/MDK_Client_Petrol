export default function DataTableSyncIcon(context) {
    if (context.getBindingObject()['@sap.isLocal']) {
        return '/SAPAssetManager/Images/grid_sync.png';
    }
    return '/SAPAssetManager/Images/no_grid_icon.png';
}
