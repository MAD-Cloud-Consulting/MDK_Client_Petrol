import libForm from '../../Common/Library/FormatLibrary';
import libMobile from '../../MobileStatus/MobileStatusLibrary';

export default function NotificationDetailsTaskListFormat(context) {
    var binding = context.getBindingObject();
    switch (context.getProperty()) {
        case 'Title':
            return libForm.getFormattedKeyDescriptionPair(context, binding.TaskSortNumber, binding.TaskText);
        case 'Subhead':
            return context.localizeText('group') + ' | ' + binding.TaskCodeGroup;
        case 'Footnote':
            return context.read('/SAPAssetManager/Services/AssetManager.service', `PMCatalogCodes(Catalog='2', Code='${binding.TaskCode}', CodeGroup='${binding.TaskCodeGroup}')`, [], '').then(function(data) {
                if (data && data.length > 0) {
                    return data.getItem(0).CodeDescription;
                } else {
                    return '';
                }
            });
        case 'StatusText':
            return libMobile.mobileStatus(context, binding).then(function(mStatus) {
                return context.localizeText(mStatus);
            });
        default:
            return '';
    }
}
