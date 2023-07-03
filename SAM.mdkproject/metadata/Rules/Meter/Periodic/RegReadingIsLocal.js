export default function RegReadingIsLocal(context) {
    if (context.binding['@sap.isLocal']) {
        return '/SAPAssetManager/Images/grid_sync.png';
    }
    return '/SAPAssetManager/Images/no_grid_icon.png';
}
