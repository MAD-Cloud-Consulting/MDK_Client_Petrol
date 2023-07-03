import libCom from '../Common/Library/CommonLibrary';
import LocationTrackingToggle from './LocationTrackingToggle';
import personaLib from '../Persona/PersonaLibrary';

export default function CheckForChangesBeforeCancel(context) {
    let persona = personaLib.getActivePersona(context);
    let isOn = libCom.getStateVariable(context, 'LocationTrackingSwitch');

    libCom.removeStateVariable(context, 'LocationTrackingSwitch');

    if (context.evaluateTargetPath('#Control:SwitchPersonaLstPkr/#SelectedValue') !== persona ||
        context.evaluateTargetPath('#Control:LocationTrackingSwitch').getValue() !== isOn) {
        return LocationTrackingToggle(context, persona, isOn).then(function() {
            return context.executeAction('/SAPAssetManager/Actions/Page/CancelPage.action');
        });
    }
    return context.executeAction('/SAPAssetManager/Actions/Page/CancelPage.action');
}
