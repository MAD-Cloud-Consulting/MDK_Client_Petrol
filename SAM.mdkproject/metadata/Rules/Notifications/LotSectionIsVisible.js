/**
* Describe this function...
* @param {IClientAPI} context
*/
import userFeaturesLib from '../UserFeatures/UserFeaturesLibrary';
export default function LotSectionIsVisible(context) {
    if (userFeaturesLib.isFeatureEnabled(context,context.getGlobalDefinition('/SAPAssetManager/Globals/Features/QM.global').getValue())) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', `NotificationTypes('${context.getPageProxy().binding.NotificationType}')`, [], '$select=NotifCategory').then(type => {
            return type.getItem(0).NotifCategory === '02';
        });
    } else {
        return false;
    }
}
