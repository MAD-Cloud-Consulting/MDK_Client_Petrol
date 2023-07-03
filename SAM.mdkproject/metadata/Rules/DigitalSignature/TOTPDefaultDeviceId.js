import libcomm from '../Common/Library/CommonLibrary';

export default function TOTPDefaultDeviceID(context) {
    return String(libcomm.getStateVariable(context, 'TOTPDefaultDeviceId'));
}
