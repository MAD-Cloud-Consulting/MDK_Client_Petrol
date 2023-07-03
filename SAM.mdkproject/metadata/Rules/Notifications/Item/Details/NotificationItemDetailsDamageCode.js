import {ValueIfExists} from '../../../../../SAPAssetManager/Rules/Common/Library/Formatter';

export default function NotificationItemDetailsDamageCode(context) {
    return ValueIfExists(context.binding.DamageCode, '-', function(value) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', `PMCatalogCodes(Catalog='${context.binding.DefectType}',CodeGroup='${context.binding.CodeGroup}',Code='${context.binding.DamageCode}')`, [], '').then(result => {
            if (result && result.length > 0) {
                return `${value} - ${result.getItem(0).CodeDescription}`;
            } else {
                return value;
            }
        });
    });
}
