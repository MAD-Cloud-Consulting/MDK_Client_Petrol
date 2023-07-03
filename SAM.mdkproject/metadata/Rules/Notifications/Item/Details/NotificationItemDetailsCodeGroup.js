import {ValueIfExists} from '../../../../../SAPAssetManager/Rules/Common/Library/Formatter';

export default function NotificationItemDetailsCodeGroup(context) {
    return ValueIfExists(context.binding.CodeGroup, '-', function(value) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', `PMCatalogCodes(Catalog='${context.binding.DefectType}',CodeGroup='${context.binding.CodeGroup}',Code='${context.binding.DamageCode}')`, [], '').then(result => {
            if (result && result.length > 0) {
                return `${value} - ${result.getItem(0).CodeGroupDesc}`;
            } else {
                return value;
            }
        });
    });
}
