import { ValueIfExists } from '../../Common/Library/Formatter';
import common from '../../Common/Library/CommonLibrary';
import libMobile from '../../MobileStatus/MobileStatusLibrary';
import checkDigitalSignatureState from '../../DigitalSignature/CheckDigitalSignatureState';
import digitalSigLib from '../../DigitalSignature/DigitalSignatureLibrary';
import userFeaturesLib from '../../UserFeatures/UserFeaturesLibrary';

export default function NotificationDetailsHeaderFormat(context) {
    var binding = context.binding;
    var priority;
    switch (context.getProperty()) {
        case 'HeadlineText':
            return ValueIfExists(context.binding.NotificationDescription, '-');
        case 'BodyText':
            return context.read('/SAPAssetManager/Services/AssetManager.service', binding['@odata.readLink'] + '/FunctionalLocation', [], '')
                .then(function(data) {
                    if (data.length > 0) {
                        var item = data.getItem(0);
                        return `${item.FuncLocId} - ${item.FuncLocDesc}`;
                    } else {
                        return '';
                    }
                });
        case 'Footnote':
            return context.read('/SAPAssetManager/Services/AssetManager.service', binding['@odata.readLink'] + '/Equipment', [], '')
                .then(function(data) {
                    if (data.length > 0) {
                        var item = data.getItem(0);
                        return item.EquipDesc + ' (' + item.EquipId + ')';
                    } else {
                        return '';
                    }
                });
        case 'Description':
            return '';
        case 'StatusImage':
            priority = binding.NotifPriority.Priority;
            return common.shouldDisplayPriorityIcon(context,parseInt(priority));
        case 'SubstatusText':
            priority = binding.NotifPriority;
            return ValueIfExists(priority, context.localizeText('none'), function(value) {
                return value.PriorityDescription;
            });
        case 'Tags': {
            var tags = [];
            tags.push(context.getBindingObject().NotificationType);
            if (userFeaturesLib.isFeatureEnabled(context,context.getGlobalDefinition('/SAPAssetManager/Globals/Features/QM.global').getValue()) && context.getBindingObject().hasOwnProperty('QMCodeGroup')) {
                tags.push(context.getBindingObject().QMCodeGroup + context.getBindingObject().QMCode);
            }
            let mobileStatus = libMobile.getMobileStatus(binding, context);
            if (mobileStatus && mobileStatus !== '') {
                tags.push(context.localizeText(mobileStatus));
            }
            if (digitalSigLib.isDigitalSignatureEnabled(context)) {
                return checkDigitalSignatureState(context).then(function(state) {
                    if (state !== '') {
                        tags.push(context.localizeText('signed'));
                        return tags;
                    } else {
                        return tags;
                    }
                }).catch(() => {
                    return tags;
                });
            } else {
                return tags;
            }
        }
        default:
            return '';
    }
}
