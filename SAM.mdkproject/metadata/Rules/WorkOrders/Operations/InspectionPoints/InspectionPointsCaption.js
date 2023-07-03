/**
* Sets the caption on the Inspection Points List page
* @param {IClientAPI} context
*/
export default function InspectionPointsCaption(context) {
    return context.count('/SAPAssetManager/Services/AssetManager.service', context.getPageProxy().binding['@odata.readLink'] + '/InspectionPoint_Nav', '').then(function(count) {
        return context.localizeText('inspection_points_x', [count]);
    });
}
