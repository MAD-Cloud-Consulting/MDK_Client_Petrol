/**
* Show the Inspection Points section if there are any
* @param {IClientAPI} context
*/


export default function InspectionPointsIsVisible(context) {
    return context.count('/SAPAssetManager/Services/AssetManager.service', context.getPageProxy().binding['@odata.readLink'] + '/InspectionPoint_Nav', '').then(function(count) {
        return count > 0 ? true : false;
    });
}
