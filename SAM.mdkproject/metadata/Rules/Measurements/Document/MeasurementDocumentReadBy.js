import libPoint from '../MeasuringPointLibrary';

export default function MeasurementDocumentReadBy(pageClientAPI) {

    if (!pageClientAPI) {
        throw new TypeError('Context can\'t be null or undefined');
    }
    if (pageClientAPI.binding['@odata.type'] === pageClientAPI.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WorkOrderTool.global').getValue()) {
        pageClientAPI.setActionBinding(pageClientAPI.binding.PRTPoint);
    }
    return libPoint.measurementDocumentCreateUpdateSetODataValue(pageClientAPI, 'ReadBy');

}
