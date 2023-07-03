
import libLocationTracking from '../LocationTracking/LocationTrackingLibrary';
import libVal from '../Common/Library/ValidationLibrary';
import libPersona from '../Persona/PersonaLibrary';

export default function LocationTrackingInitValue(context) {
    let userSwitch = libLocationTracking.getUserSwitch(context, libPersona.getActivePersona(context));
    return libVal.evalIsEmpty(userSwitch) ? false : userSwitch === 'on';
}
