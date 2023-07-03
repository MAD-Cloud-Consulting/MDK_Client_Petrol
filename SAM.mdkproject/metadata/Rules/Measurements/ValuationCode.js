import libForm from '../Common/Library/FormatLibrary';
export default function ValuationCode(context) {
    if (context.binding.ValuationCode && context.binding.CodeShortText) {
        return libForm.getFormattedKeyDescriptionPair(context, context.binding.ValuationCode, context.binding.CodeShortText);
    } else {
        return '-';
    }
}
