import libForm from '../Common/Library/FormatLibrary';

export default function MaterialDetailsCaption(context) {
    return libForm.formatDetailHeaderDisplayValue(context, context.binding.Material, 
        context.localizeText('material'));
}
