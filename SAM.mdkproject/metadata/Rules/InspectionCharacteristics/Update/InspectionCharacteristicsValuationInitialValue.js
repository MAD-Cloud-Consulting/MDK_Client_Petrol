
export default function InspectionCharacteristicsValuationInitialValue(context) {
    if (context.binding.Valuation) {
        return `InspectionResultValuations('${context.binding.Valuation}')`;
    } else {
        return '';
    }
}
