import libFormat from '../Common/Library/FormatLibrary';

export default function DisplayValueValuationCode(context) {
	
    let binding = context.binding;
    return libFormat.formatListPickerDisplayValue(context, binding.Code, binding.CodeDescription);

}
