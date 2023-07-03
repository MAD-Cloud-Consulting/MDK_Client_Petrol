import point from './CrewVehicleOdometerPoint';

export default function CrewVehicleOdometerLastMeasuringDoc(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', `MeasuringPoints('${point(context)}')/MeasurementDocs`, [], '$top=1&$orderby=ReadingTimestamp desc').then(function(result) {
        if (result && result.length > 0) {
            return result.getItem(0)['@odata.readLink'];
        } else {
            return '';
        }
    });
}
