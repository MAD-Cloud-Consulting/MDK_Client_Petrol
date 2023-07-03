export default function MeasuringPointDisplayValue(pageClientAPI) {
    let binding = pageClientAPI.binding;
    if (binding['@odata.type'] === pageClientAPI.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WorkOrderTool.global').getValue()) {
        binding = binding.PRTPoint;
    }
    if (!binding.hasOwnProperty('Point')) {
        binding =  binding.MeasuringPoint;
    }
    return binding.Point;
}
