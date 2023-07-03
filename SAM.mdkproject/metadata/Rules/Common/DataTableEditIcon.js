export default function DataTableEditIcon(context) {
    if (context.getBindingObject()['@sap.isLocal']) {
            return '/SAPAssetManager/Images/grid_edit.png';
    }
    return '/SAPAssetManager/Images/no_grid_icon.png';
}
