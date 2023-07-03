export default function MeasuringPointUpperRangeVisible(pageClientAPI) {

    let binding = pageClientAPI.binding;

    if (binding['@odata.type'] === pageClientAPI.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WorkOrderTool.global').getValue()) {
        binding = binding.PRTPoint;
    }
    if (binding.MeasuringPoint) {
        binding = binding.MeasuringPoint;
    }

    if (binding.UpperRange) {
        return true;
    }
    
    return false;
}
