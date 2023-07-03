import inspCharLib from './InspectionCharacteristics';
import quantitativeValue from './InspectionCharacteristicsQuantitativeValue';

export default function InspectionCharacteristicsValuationReadLink(context) {
    if (inspCharLib.isQualitative(context.binding)) {
        return "InspectionResultValuations('" + context.binding.Valuation + "')";
    }
    
    let value = quantitativeValue(context);
    let valueAccepted = false;
    if ((inspCharLib.isQuantitative(context.binding) || inspCharLib.isCalculatedAndQuantitative(context.binding)) && (context.binding.TargetValue === value )) {
        valueAccepted = true;
    } else {
        if (context.binding.LowerLimitFlag === 'X' && context.binding.LowerLimit <= value) {
            valueAccepted = true;
        }
        if (valueAccepted && context.binding.UpperLimitFlag === 'X') {
            if (context.binding.UpperLimit >= value) {
                valueAccepted = true;
            } else {
                valueAccepted = false;
            }
        }
    }
    if (valueAccepted) {
        return "InspectionResultValuations('A')";
    }

    return "InspectionResultValuations('R')";
}
