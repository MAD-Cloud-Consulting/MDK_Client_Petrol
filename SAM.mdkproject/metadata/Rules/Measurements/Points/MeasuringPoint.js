export default function MeasuringPoint(pageClientAPI) {
    let binding = pageClientAPI.binding;
    if (binding['@odata.type'] === pageClientAPI.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WorkOrderTool.global').getValue()) {
        return binding.PRTPoint.Point;
    }
    if (binding.hasOwnProperty('Point')) {
        return binding.Point;
    } else {
        return binding.MeasuringPoint.Point;
    }
}
