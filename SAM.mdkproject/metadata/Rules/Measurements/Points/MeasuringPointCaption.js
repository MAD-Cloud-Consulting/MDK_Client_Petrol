import libVal from '../../Common/Library/ValidationLibrary';
export default function MeasuringPointCaption(pageClientAPI) {
    let binding = pageClientAPI.binding;
    if (binding['@odata.type'] === pageClientAPI.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WorkOrderTool.global').getValue()) {
        binding = binding.PRTPoint;
    }
    if (!binding.hasOwnProperty('Point')) {
        binding =  binding.MeasuringPoint;
    }

    if (!libVal.evalIsEmpty(binding.EquipId)) {
        let label = '$(L, equipment)' + ' - ' + binding.EquipId;
        if (binding.Equipment && binding.Equipment.EquipDesc) {
            label += ' - ' + binding.Equipment.EquipDesc;
        }
        return  label;
    } else if (!libVal.evalIsEmpty(binding.FuncLocIdIntern)) {
        let label = '$(L, functional_location)';
        if (binding.FunctionalLocation) {
            if (binding.FunctionalLocation.FuncLocId) {
                label += ' - ' + binding.FunctionalLocation.FuncLocId;
            }
            if (binding.FunctionalLocation.FuncLocDesc) {
                label += ' - ' + binding.FunctionalLocation.FuncLocDesc;
            }
        }
        return label;
    }

    return '$(L,point)';
}
