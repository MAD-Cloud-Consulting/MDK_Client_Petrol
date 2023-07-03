import inspCharLib from './InspectionCharacteristics';

export default function InspectionCharacteristicsQuantitativeOrCalCulatedIsVisible(context) {
    let binding = context.binding;
    if (inspCharLib.isQuantitative(binding) || inspCharLib.isCalculatedAndQuantitative(binding)) {
        return true;
    }
    return false;
}
