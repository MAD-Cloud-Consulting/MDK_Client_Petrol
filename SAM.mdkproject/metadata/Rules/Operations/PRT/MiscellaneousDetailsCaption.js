import libForm from '../../Common/Library/FormatLibrary';

export default function MiscellaneousDetailsCaption(context) {
    return libForm.formatDetailHeaderDisplayValue(context, context.binding.PRTTool, 
        context.localizeText('miscellaneous'));
}
