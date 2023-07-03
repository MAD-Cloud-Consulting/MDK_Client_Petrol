import libForm from '../../Common/Library/FormatLibrary';

export default function NotificationDetailsActivityListFormat(context) {
    var binding = context.getBindingObject();
    switch (context.getProperty()) {
        case 'Title':
            return libForm.getFormattedKeyDescriptionPair(context, binding.ActivitySortNumber, binding.ActivityText);
        case 'Subhead':
            return context.localizeText('group') + ' | ' + binding.ActivityCodeGroup;
        case 'Footnote':
            return context.read('/SAPAssetManager/Services/AssetManager.service', `PMCatalogCodes(Catalog='A', Code='${binding.ActivityCode}', CodeGroup='${binding.ActivityCodeGroup}')`, [], '').then(function(data) {
                if (data && data.length > 0) {
                    return data.getItem(0).CodeDescription;
                } else {
                    return '';
                }
            });
        default:
            return '';
    }
}
