import inspCharLib from './InspectionCharacteristics';
import MyButtonLib from '../../../Extensions/ButtonStackModule/ButtonStackLibrary';
import deviceType from '../../Common/DeviceType';

export default function InspectionCharacteristicsValidateOrCalculateIsEditable(context) {

    let binding = context.binding;
    let validateButtonName = deviceType(context) === 'Tablet' ? 'ValidateOrCalculateButtonTablet' : 'ValidateOrCalculateButton';

    if (context.binding.Valuation === 'A') {
        MyButtonLib.setTitle(context, validateButtonName, context.localizeText('validated'));
        MyButtonLib.setEditable(context, validateButtonName, false);
        return false;
    }

    if (inspCharLib.isCalculatedAndQuantitative(binding)) {
        return true;
    } else if (inspCharLib.isQuantitative(binding)) {
        return true;
    }
    return false;
}
