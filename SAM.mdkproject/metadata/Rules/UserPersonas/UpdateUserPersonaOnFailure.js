import libCommon from '../Common/Library/CommonLibrary';

export default function UpdateUserPersonaOnFailure(context) {
    //get the missing field
    let missingField = context.getMissingRequiredControls()[0];
    let message = context.localizeText('field_is_required');

    //set the inline error
    libCommon.executeInlineControlError(context, missingField, message); 
}
