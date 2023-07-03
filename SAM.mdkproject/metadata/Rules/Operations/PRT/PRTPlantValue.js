
/**
 * Returns the total count of work order history objects for an asset.
 * @param {*} context SectionProxy object.
 * @returns {Number} Total count of Workorder history objects.
 */
export default function PRTPlantValue(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'PRTControlKeys', [], `$filter=PRTControlKey eq '${context.binding.ControlKey}'`).then(result => {
        if (result && result.getItem(0)) {
            return result.getItem(0).PRTControlKeyDesc;
        }
        return '-';
    });
}
