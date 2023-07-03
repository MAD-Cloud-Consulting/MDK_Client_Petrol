import libcomm from '../Common/Library/CommonLibrary';

export default function TOTPDefaultDeviceReadLink(context) {
    return libcomm.getStateVariable(context, 'TOTPDefaultDeviceReadLink');
}
