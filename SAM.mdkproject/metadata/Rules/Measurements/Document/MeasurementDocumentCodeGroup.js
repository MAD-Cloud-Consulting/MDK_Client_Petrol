import libPoint from '../MeasuringPointLibrary';

export default function MeasurementDocumentCodeGroup(pageClientAPI) {

    if (!pageClientAPI) {
        throw new TypeError('Context can\'t be null or undefined');
    }
    if (pageClientAPI.binding['@odata.type'] === '#sap_mobile.MyWorkOrderTool') {
        pageClientAPI.setActionBinding(pageClientAPI.binding.PRTPoint);
    }
    return libPoint.measurementDocumentCreateUpdateSetODataValue(pageClientAPI, 'CodeGroup');

}
