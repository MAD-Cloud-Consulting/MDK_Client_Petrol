import inspCharLib from './InspectionCharacteristics';
import Logger from '../../Log/Logger';

export default function InspectionCharacteristicsTargetSpecification(context) {
    let binding = context.binding;
    if (inspCharLib.isQuantitative(binding) || inspCharLib.isCalculatedAndQuantitative(binding)) {
        try {
            let uom = binding.UoM || '';
            if (!uom) {
                if (binding.MasterInspChar_Nav) {
                    uom = binding.MasterInspChar_Nav.UoM;
                }
            }
            let lowerLimit = binding.LowerLimitFlag === 'X' ? binding.LowerLimit : '-∞';
            let upperLimit = binding.UpperLimitFlag === 'X' ? binding.UpperLimit : '∞';
            return `${lowerLimit} ${uom} - ${upperLimit} ${uom} (${context.localizeText('target_value')} ${binding.TargetValue})`;
        } catch (err) {
            Logger.error(`Failed to populate the target spec: ${err}`);
            return '-';
        }
    }
    return '-';
}
