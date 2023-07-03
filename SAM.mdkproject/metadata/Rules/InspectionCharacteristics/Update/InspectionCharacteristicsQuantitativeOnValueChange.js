import inspCharLib from './InspectionCharacteristics';
import MyButtonLib from '../../../../SAPAssetManager/Extensions/ButtonStackModule/ButtonStackLibrary';
import deviceType from '../../Common/DeviceType';

export default function InspectionCharacteristicsQuantitativeOnValueChange(context) {
    let binding = context.binding;
    let name = context.getName();
    let suffix = name.substring(name.indexOf('_'), name.length);
    let extensionName;
    let validateButtonName;

    if (deviceType(context) === 'Tablet') {
        extensionName = 'MyExtensionControlName';
        validateButtonName = 'ValidateOrCalculateButtonTablet';
    } else {
        extensionName = 'MyExtensionControlNameValidate';
        validateButtonName = 'ValidateOrCalculateButton';
    }

    let buttonStack = extensionName + suffix;
    let contextProxy = context._control._parent.getCellProxyWithName(buttonStack)._control._extension.context._clientAPI;
    if (inspCharLib.isCalculatedAndQuantitative(binding)) {
        MyButtonLib.setTitle(contextProxy, validateButtonName, context.localizeText('calculate'));
        MyButtonLib.setEditable(contextProxy, validateButtonName, true);
    } else if (inspCharLib.isQuantitative(binding)) {
        MyButtonLib.setTitle(contextProxy, validateButtonName, context.localizeText('validate'));
        MyButtonLib.setEditable(contextProxy, validateButtonName, true);
    }

    // clear validation if length of value at least 1 (in order to avoid clearing on each user input)
    if (context.getValue().length === 1) {
        context.clearValidation();
    }
}
