import point from './CrewVehicleOdometerPoint';

export default function CrewVehicleOdometerLastMeasurementDocNum(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', `MeasuringPoints('${point(context)}')/MeasurementDocs`, [], '$select=MeasurementDocNum&$top=1&$orderby=ReadingTimestamp desc').then(function(result) {
        if (result && result.length > 0) {
            return result.getItem(0).MeasurementDocNum;
        } else {
            return '';
        }
    });
}
