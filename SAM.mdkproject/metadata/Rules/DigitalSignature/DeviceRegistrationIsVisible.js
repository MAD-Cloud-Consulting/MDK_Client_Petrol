import checkDeviceRegistration from './CheckDeviceCreation';
import digSigLib from './DigitalSignatureLibrary';

export default function DeviceRegistrationIsVisible(context) {
    if (digSigLib.isDigitalSignatureEnabled(context)) {
        return checkDeviceRegistration(context).then(register => {
            return !register;
        });
    }
    return false;
}
