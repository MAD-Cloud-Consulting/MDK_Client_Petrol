import libCom from '../../../Common/Library/CommonLibrary';

export default function OffsetsValidation(context,control_1,control_2) {

    if (!libCom.getListPickerValue(control_1.getValue()) ||
        !libCom.getListPickerValue(control_2.getValue())) {
            control_1.clearValidationOnValueChange();
            control_2.clearValidationOnValueChange();
    } else if (libCom.isDefined(control_1.getValue()) && libCom.isDefined(control_2.getValue())) {
        if (control_1.getValue()[0].ReturnValue === control_2.getValue()[0].ReturnValue) {
            let message = context.localizeText('validation_offsets_types_are_same');
            libCom.executeInlineControlError(context, control_1, message);
            libCom.executeInlineControlError(context, control_2, message);
        } else {
            control_1.clearValidationOnValueChange();
            control_2.clearValidationOnValueChange();
        }
    } 
        
}
