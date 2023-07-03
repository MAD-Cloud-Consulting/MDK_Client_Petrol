import Logger from '../../Log/Logger';
import isAndroid from '../../Common/IsAndroid';

export default function MeasuringPointIcons(context) { //Check if there are local readings for this point

    let readLink = context.binding['@odata.readLink'];
    let expand = '/MeasurementDocs';
    if (context.binding['@odata.type'] === '#sap_mobile.MyWorkOrderTool') { //PRT points
        expand = '/PRTPoint/MeasurementDocs';
    }
    return context.read('/SAPAssetManager/Services/AssetManager.service', readLink + expand, [], '$select=MeasurementDocNum').then(function(results) {
        if (results && results.length > 0) {
            for (var i = 0; i < results.length; i++) {
                if (results.getItem(i)['@sap.isLocal']) {
                    return [isAndroid(context) ? '/SAPAssetManager/Images/syncOnListIcon.android.png' : '/SAPAssetManager/Images/syncOnListIcon.png'];
                }
            }
        }
        return [];
    }).catch((error) => {
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryMeasuringPoints.global').getValue(), error);
        return [];
    });
}
