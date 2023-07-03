
import libLocationTracking from '../LocationTracking/LocationTrackingLibrary';

export default function LocationTrackingToggle(context, persona = undefined, isOn = undefined) {
    let userSwitch = context.evaluateTargetPath('#Page:UserProfileSettings/#Control:LocationTrackingSwitch');
    if (isOn === undefined) {
        isOn = userSwitch.getValue();
    }
    if (persona === undefined) {
        persona = context.evaluateTargetPath('#Page:UserProfileSettings/#Control:SwitchPersonaLstPkr/#SelectedValue');
    }

    if (isOn) {
        return libLocationTracking.enableService(context).then((isEnabled) => {
            if (isEnabled) {
                libLocationTracking.setUserSwitch(context, persona, 'on');
                userSwitch.setValidationProperty('ValidationMessage',
                    context.localizeText('location_tracking_enabled_prompt'));
            } else { // turn off the switch control immediately
                userSwitch.setValue(false);
                userSwitch.setValidationProperty('ValidationMessage',
                    context.localizeText('location_tracking_disabled_prompt'));
            }
            context.redraw();
        });
    } else {
        libLocationTracking.disableService();
        libLocationTracking.setUserSwitch(context, persona, 'off');
        return Promise.resolve(true);
    }
}
