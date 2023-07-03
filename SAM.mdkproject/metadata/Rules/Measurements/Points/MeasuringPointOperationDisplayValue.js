export default function MeasuringPointOperationDisplayValue(pageClientAPI) {

    let binding = pageClientAPI.binding;

    if (binding['@odata.type'] === pageClientAPI.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WorkOrderTool.global').getValue()) {
        binding = binding.WOOperation_Nav;
    }
    if (binding.MeasuringPoint) {
        binding = binding.MeasuringPoint;
    }

    if (binding.OperationNo) { //PRT for operations
        return binding.OperationNo;
    }

    let data = pageClientAPI.getPageProxy().getClientData().MeasuringPointData; //Regular rows
    if (data.hasOwnProperty(binding.Point)) {
        let row = data[binding.Point];
        if (row.OperationNo) {
            return row.OperationNo;
        }
    }
    
    return '';
}
