import libForm from '../../Common/Library/FormatLibrary';
import userFeaturesLib from '../../UserFeatures/UserFeaturesLibrary';

export default function NotificationDetailsItemListFormat(context) {
    var binding = context.getBindingObject();
    if (userFeaturesLib.isFeatureEnabled(context,context.getGlobalDefinition('/SAPAssetManager/Globals/Features/QM.global').getValue())) {
        if (binding.hasOwnProperty('Notification') && binding.Notification.hasOwnProperty('NotificationType')) {
            return context.read('/SAPAssetManager/Services/AssetManager.service', `NotificationTypes('${binding.Notification.NotificationType}')`, [], '').then(result => {
                var qmNotification = (result.getItem(0).NotifCategory === '02');
                switch (context.getProperty()) {
                    case 'Title':
                        if (qmNotification) {
                            return libForm.getFormattedKeyDescriptionPair(context, binding.CodeGroup, binding.ItemText);
                        } else {
                            return libForm.getFormattedKeyDescriptionPair(context, binding.ItemNumber, binding.ItemText);
                        }
                    case 'Subhead':
                        if (qmNotification) {
                            if (binding.InspectionPoint_Nav && binding.InspectionPoint_Nav.EquipNum) {
                                return context.localizeText('equipment') + ' ' + binding.InspectionPoint_Nav.EquipNum;
                            } else if (binding.InspectionPoint_Nav && binding.InspectionPoint_Nav.FuncLocId) {
                                return context.localizeText('functional_location') + ' ' + binding.InspectionPoint_Nav.FuncLocId;
                            }
                            return '';
                        } else {
                            return context.read('/SAPAssetManager/Services/AssetManager.service', `PMCatalogCodes(Catalog='${result.getItem(0).CatTypeObjectParts}', Code='${binding.ObjectPart}', CodeGroup='${binding.ObjectPartCodeGroup}')`, [], '').then(function(data) {
                                if (data && data.length > 0) {
                                    return data.getItem(0).CodeDescription;
                                } else {
                                    return '';
                                }
                            });
                        }
                    case 'Footnote':
                        if (qmNotification) {
                            return context.localizeText('defect') + ' ' + binding.DamageCode;
                        } else {
                            return context.read('/SAPAssetManager/Services/AssetManager.service', `PMCatalogCodes(Catalog='${result.getItem(0).CatTypeDefects}', Code='${binding.DamageCode}', CodeGroup='${binding.CodeGroup}')`, [], '').then(function(codeData) {
                                if (codeData && codeData.length > 0) {
                                    return libForm.getFormattedKeyDescriptionPair(context, binding.DamageCode, codeData.getItem(0).CodeDescription);
                                } else {
                                    return context.localizeText('no_damage_code_specified');
                                }
                            });
                        }
                    case 'StatusText':
                        return binding.ObjectPartCodeGroup;
                    default:
                        return '';
                }
            });
        }

    } else {
        switch (context.getProperty()) {
            case 'Title':
                return libForm.getFormattedKeyDescriptionPair(context, binding.ItemNumber, binding.ItemText);
            case 'Subhead':
                return context.read('/SAPAssetManager/Services/AssetManager.service', `PMCatalogCodes(Catalog='B', Code='${binding.ObjectPart}', CodeGroup='${binding.ObjectPartCodeGroup}')`, [], '').then(function(data) {
                    if (data && data.length > 0) {
                        return data.getItem(0).CodeDescription;
                    } else {
                        return '';
                    }
                });
            case 'Footnote':
                return context.read('/SAPAssetManager/Services/AssetManager.service', `PMCatalogCodes(Catalog='C', Code='${binding.DamageCode}', CodeGroup='${binding.CodeGroup}')`, [], '').then(function(codeData) {
                    if (codeData && codeData.length > 0) {
                        return libForm.getFormattedKeyDescriptionPair(context, binding.DamageCode, codeData.getItem(0).CodeDescription);
                    } else {
                        return context.localizeText('no_damage_code_specified');
                    }
                });
            case 'StatusText':
                return binding.ObjectPartCodeGroup;
            default:
                return '';
        }
    }

}
