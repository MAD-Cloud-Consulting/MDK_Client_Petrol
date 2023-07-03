import libPoint from '../MeasuringPointLibrary';

export default function MeasurementDocumentValuationCodeDescription(pageClientAPI) {
    return libPoint.measurementDocumentCreateUpdateSetODataValue(pageClientAPI, 'CodeDescription');
}
