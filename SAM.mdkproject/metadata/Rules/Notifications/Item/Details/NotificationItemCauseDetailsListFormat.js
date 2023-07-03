import libForm from '../../../Common/Library/FormatLibrary';

export default function NotificationItemCauseDetailsListFormat(context) {
    var property = context.getProperty();
    var binding = context.getBindingObject();
    switch (property) {
        case 'Title':
            return libForm.getFormattedKeyDescriptionPair(context, binding.CauseSortNumber, binding.CauseText);
        case 'Subhead':
            return context.localizeText('group') + ' | ' + binding.CauseCodeGroup;
        case 'Footnote':
            return context.read('/SAPAssetManager/Services/AssetManager.service', 'PMCatalogCodes', [], "$filter=Catalog eq '5' and CodeGroup eq '" + binding.CauseCodeGroup + "' and Code eq '" + binding.CauseCode + "'").then(function(codeData) {
                return libForm.getFormattedKeyDescriptionPair(context, codeData.getItem(0).Code, codeData.getItem(0).CodeDescription);
            });
        default:
            return '';
    }
}
