import libForm from '../../../Common/Library/FormatLibrary';

export default function NotificationItemActivityDetailsListFormat(context) {
    var property = context.getProperty();
    var binding = context.getBindingObject();
    switch (property) {
        case 'Title':
            return libForm.getFormattedKeyDescriptionPair(context, binding.ActivitySortNumber, binding.ActivityText);
        case 'Subhead':
            return context.localizeText('group') + ' | ' + binding.ActivityCodeGroup;
        case 'Footnote':
            return context.read('/SAPAssetManager/Services/AssetManager.service', 'PMCatalogCodes', [], "$filter=Catalog eq 'A' and CodeGroup eq '" + binding.ActivityCodeGroup + "' and Code eq '" + binding.ActivityCode + "'").then(function(codeData) {
                return libForm.getFormattedKeyDescriptionPair(context, codeData.getItem(0).Code, codeData.getItem(0).CodeDescription);
            });
        default:
            return '';
    }
}
