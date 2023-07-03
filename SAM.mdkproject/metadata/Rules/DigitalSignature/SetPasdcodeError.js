/**
* Describe this function...
* @param {IClientAPI} context
*/
import libCommon from '../Common/Library/CommonLibrary';

export default function SetPasdcodeError(context) {
    //get the missing fields
    let missingRequiredFields = context.getMissingRequiredControls();
    let message = context.localizeText('passcode_is_mandatory');

    //set the inline error
    for (let control of missingRequiredFields) {
        libCommon.executeInlineControlError(context, control, message);
    }
}
