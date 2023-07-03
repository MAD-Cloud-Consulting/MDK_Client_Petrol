export default function MeasuringPointLowerRangeDisplayValue(pageClientAPI) {

    let binding = pageClientAPI.binding;

    if (binding['@odata.type'] === pageClientAPI.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WorkOrderTool.global').getValue()) {
        binding = binding.PRTPoint;
    }
    if (binding.MeasuringPoint) {
        binding = binding.MeasuringPoint;
    }

    if (binding.LowerRange) {
        return binding.LowerRange;
    }
 
    return '';
}
