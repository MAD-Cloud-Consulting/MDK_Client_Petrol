import libCom from '../../Common/Library/CommonLibrary';

export default function GLAccountValidateLength(context) {
    
    const noteValue = context.getValue();
    let charLimit = Number(context.getGlobalDefinition('/SAPAssetManager/Globals/Inventory/GLAccountFieldLength.global').getValue());

    if (noteValue && noteValue.length > charLimit) {
        let note = noteValue.substring(0, charLimit);
        context.setValue(note); 
        libCom.setInlineControlError(context, context, context.localizeText('validation_maximum_field_length', [charLimit]));
        context.applyValidation();
    } else {
        if (noteValue.length < charLimit && !context._control._validationProperties.ValidationViewIsHidden) {
            context.clearValidationOnValueChange();
        }
    }
}
