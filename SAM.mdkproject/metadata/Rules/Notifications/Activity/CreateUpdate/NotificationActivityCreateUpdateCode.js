import notification from '../../NotificationLibrary';
import common from '../../../Common/Library/CommonLibrary';
import userFeaturesLib from '../../../UserFeatures/UserFeaturesLibrary';

export default function NotificationActivityCreateUpdateCode(context) {

    if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/QM.global').getValue())) {
        let binding = context.getPageProxy().binding;
        let codeGroup = context.getValue()[0].ReturnValue;
        var targetList = context.getPageProxy().evaluateTargetPathForAPI('#Control:CodeLstPkr');
        var specifier = targetList.getTargetSpecifier();

        let notifLookup = Promise.resolve(binding.NotificationType);

        if (binding['@odata.type'] !== '#sap_mobile.MyNotificationHeader') {
            if (binding['@odata.type'] === '#sap_mobile.MyNotificationItem' || binding['@odata.type'] === '#sap_mobile.MyNotificationActivity') {
                binding = binding.Notification;
                notifLookup = Promise.resolve(binding.NotificationType);
            } else if (binding['@odata.type'] === '#sap_mobile.MyNotificationItemActivity') {
                binding = binding.Item.Notification;
                notifLookup = Promise.resolve(binding.NotificationType);
            } else if (binding['@odata.type'] === '#sap_mobile.InspectionCharacteristic') {
                notifLookup = context.read('/SAPAssetManager/Services/AssetManager.service', `OrderTypes(PlanningPlant='${context.binding.InspectionLot_Nav.WOHeader_Nav.PlanningPlant}',OrderType='${context.binding.InspectionLot_Nav.WOHeader_Nav.OrderType}')`, [], '').then(result => {
                    return result.getItem(0).QMNotifType;
                });
            } else {
                binding = common.getStateVariable(context, 'CreateNotification');
                notifLookup = Promise.resolve(binding.NotificationType);
            }
        }
        return notifLookup.then(type => {
            return context.read('/SAPAssetManager/Services/AssetManager.service', `NotificationTypes('${type}')`, [], '').then(notifType => {
                if (notifType.getItem(0).NotifCategory === '02') { // QM Notification
                    specifier.setDisplayValue('{{#Property:Code}} - {{#Property:CodeDescription}}');
                    specifier.setReturnValue('{Code}');

                    specifier.setEntitySet('PMCatalogCodes');
                    specifier.setService('/SAPAssetManager/Services/AssetManager.service');

                    common.setEditable(targetList, true);
                    specifier.setQueryOptions(`$filter=CodeGroup eq '${codeGroup}' and Catalog eq '${notifType.getItem(0).CatTypeActivities}'&$orderby=Code,CodeGroup,Catalog`);
                    return targetList.setTargetSpecifier(specifier);
                } else { // PM Notification
                    return notification.NotificationTaskActivityCreateUpdateCode(context, 'CatTypeActivities');
                }
            });
        });
    } else {
        return notification.NotificationTaskActivityCreateUpdateCode(context, 'CatTypeActivities');
    }

}
