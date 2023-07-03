import inspCharLib from './InspectionCharacteristics';

export default function InspectionCharacteristicsValuationQueryOptions(context) {
    let binding = context.binding;
    if (inspCharLib.isQualitative(binding) || inspCharLib.isQuantitative(binding) || inspCharLib.isCalculatedAndQuantitative(binding)) {
        return "$filter=Valuation eq '{Valuation}'";
    }
    return '';
}
