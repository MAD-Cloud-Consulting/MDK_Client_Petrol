import inspCharLib from './InspectionCharacteristics';

export default function InspectionCharacteristicsValidateOrCalculateTitle(context) {
    if (inspCharLib.isCalculatedAndQuantitative(context.binding)) {
        return context.localizeText('calculate');
    }
    return context.localizeText('validate');
}
