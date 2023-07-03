import libCom from '../../../Common/Library/CommonLibrary';
import libVal from '../../../Common/Library/ValidationLibrary';

export default function EndValidation(context,control,end,length_field) {

    if (libVal.evalIsEmpty(end) && length_field) {
        let message = context.localizeText('end_point_is_required');
        libCom.executeInlineControlError(context, control, message);   
    } else {
        context.clearValidationOnValueChange();
    }
}
