import libVal from '../../Common/Library/ValidationLibrary';

export default function InspectionCharacteristicsQualitativeInitialValue(context) {
    if (!libVal.evalIsEmpty(context.binding.SelectedSetPlant) && !libVal.evalIsEmpty(context.binding.SelectedSet) && !libVal.evalIsEmpty(context.binding.Catalog) && !libVal.evalIsEmpty(context.binding.CodeGroup) && !libVal.evalIsEmpty(context.binding.Code)) {
        return `InspectionCodes(Plant='${context.binding.SelectedSetPlant}',SelectedSet='${context.binding.SelectedSet}',Catalog='${context.binding.Catalog}',CodeGroup='${context.binding.CodeGroup}',Code='${context.binding.Code}')`;
    }
    return '';
}
