import checkDeviceRegistration from './CheckDeviceCreation';
import digSigLib from './DigitalSignatureLibrary';

export default function DeviceDeRegistrationIsVisible(context) {
    if (digSigLib.isDigitalSignatureEnabled(context)) {
        return checkDeviceRegistration(context);
    }
    return false;
}
