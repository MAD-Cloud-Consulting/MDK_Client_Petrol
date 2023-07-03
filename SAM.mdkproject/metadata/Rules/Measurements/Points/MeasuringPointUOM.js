import {ValueIfExists} from '../../Common/Library/Formatter';

export default function MeasuringPointUOM(pageClientAPI) {
    if (!pageClientAPI) {
        throw new TypeError('Context can\'t be null or undefined');
    }
    let binding = pageClientAPI.binding;
    if (binding['@odata.type'] === pageClientAPI.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WorkOrderTool.global').getValue()) {
        return binding.PRTPoint.UoM;
    }
    if (binding.hasOwnProperty('UoM')) {
        return ValueIfExists(binding.UoM);
    } else {
        return ValueIfExists(binding.MeasuringPoint.UoM);
    }
}
