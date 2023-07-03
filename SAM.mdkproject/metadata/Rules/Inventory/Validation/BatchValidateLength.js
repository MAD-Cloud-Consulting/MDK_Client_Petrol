import libCom from '../../Common/Library/CommonLibrary';

export default function BatchValidateLength(context) {
    
    const noteValue = context.getValue();
    let charLimit = Number(context.getGlobalDefinition('/SAPAssetManager/Globals/Inventory/BatchFieldLength.global').getValue());

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

    let batchTo = context.getPageProxy().getControl('FormCellContainer').getControl('BatchNumTo');
    let valType = context.getPageProxy().getControl('FormCellContainer').getControl('ValuationTypePicker');
    let valTypeTo = context.getPageProxy().getControl('FormCellContainer').getControl('ValuationToPicker');
    let items = valType.getPickerItems().map(val => val.ReturnValue);
    let batchVal = context.getValue();
    let batchToVal = batchTo.getValue();
    let valTypeVal = valType.getValue()[0];
    let valTypeToVal = valTypeTo.getValue()[0];
    let batchSet = false;
    let valTypeSet = false;
    let valTypeToSet = false;
    if (items.includes(batchVal)) {
        switch (context._control._props.definition.name) {
            case 'BatchSimple':
                if (!batchToVal && !valTypeVal && !valTypeToVal) {
                    batchSet = true;
                    valTypeSet = true;
                    valTypeToSet = true;
                }
                break;
            case 'BatchNumTo':
                if (!valTypeToVal) {
                    valTypeToSet = true;
                }
                break;
        }
    }
    if (batchSet) {
        batchTo.setValue(batchVal);
        batchTo.redraw();
    }
    if (valTypeSet) {
        valType.setValue(batchVal);
        valType.redraw();
    }
    if (valTypeToSet) {
        valTypeTo.setValue(batchVal);
        valTypeTo.redraw();
    }
}
