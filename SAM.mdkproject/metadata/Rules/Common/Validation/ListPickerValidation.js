import libVal from '../../Common/Library/ValidationLibrary';
export default function ListPickerValidation(context) {
    if (!libVal.evalIsEmpty(context.getValue())) {
        context.clearValidationOnValueChange();
    }    
}
