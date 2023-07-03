/**
* Describe this function...
* @param {IClientAPI} context
*/
import libcomm from '../Common/Library/CommonLibrary';

export default function TOTPDeviceID(context) {
    return libcomm.getStateVariable(context, 'TOTPDeviceId');
}
