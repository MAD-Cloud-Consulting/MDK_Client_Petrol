/**
* Describe this function...
* @param {IClientAPI} context
*/
import libcomm from '../Common/Library/CommonLibrary';

export default function UserPrefsTOTPDevices(context) {
    return String(libcomm.getStateVariable(context, 'TOTPDeviceId'));
}
