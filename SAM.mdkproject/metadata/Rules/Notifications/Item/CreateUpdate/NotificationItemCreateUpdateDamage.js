import notification from '../../NotificationLibrary';
import common from '../../../Common/Library/CommonLibrary';
import userFeaturesLib from '../../../UserFeatures/UserFeaturesLibrary';
import libCom from '../../../Common/Library/CommonLibrary';

export default function NotificationItemCreateUpdateDamage(context) {
    let binding = context.getPageProxy().binding;
    if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/QM.global').getValue()) && binding) {
        let selection = context.getValue();
        let codeGroup = (selection.length > 0 && selection[0].ReturnValue) || '';
        var targetList = context.getPageProxy().evaluateTargetPathForAPI('#Control:DamageDetailsLstPkr');
        let notifLookup = Promise.resolve(binding.NotificationType);

        if (!codeGroup || context.binding.EAMChecklist_Nav) {
            return notification.NotificationItemCreateUpdateDamage(context);
        }

        if (binding['@odata.type'] !== '#sap_mobile.MyNotificationHeader' && binding['@odata.type']) {
            if (binding['@odata.type'] === '#sap_mobile.MyNotificationItem') {
                binding = binding.Notification;
                notifLookup = Promise.resolve(binding.NotificationType);
            } else if (binding['@odata.type'] === '#sap_mobile.InspectionCharacteristic') {
                notifLookup = context.read('/SAPAssetManager/Services/AssetManager.service', `OrderTypes(PlanningPlant='${context.binding.InspectionLot_Nav.WOHeader_Nav.PlanningPlant}',OrderType='${context.binding.InspectionLot_Nav.WOHeader_Nav.OrderType}')`, [], '').then(result => {
                    return result.getItem(0).QMNotifType;
                });
            } else {
                let createNotification = common.getStateVariable(context, 'CreateNotification');
                if (createNotification) {
                    binding = createNotification;
                    notifLookup = Promise.resolve(binding.NotificationType);
                }
            }
        } else {
            return notification.NotificationItemCreateUpdateDamage(context);
        }
        return notifLookup.then(type => {
            return context.read('/SAPAssetManager/Services/AssetManager.service', `NotificationTypes('${type}')`, [], '').then(notifType => {
                let defect = (binding['@odata.type'] === '#sap_mobile.InspectionCharacteristic' || (binding.InspectionLot && Number(binding.InspectionLot) !== 0)); // Are we working with a Defect Notification or not?
                if (notifType.getItem(0).NotifCategory === '02' || defect) { // QM/PM Notification, Defect

                    libCom.setStateVariable(context, 'ReturnValue', codeGroup);
                    libCom.setStateVariable(context, 'NotificationType', notifType.getItem(0).CatTypeDefects);
                    common.setEditable(targetList, true);
                    return context.read(
                        '/SAPAssetManager/Services/AssetManager.service',
                        'PMCatalogCodes',
                        ['Code', 'CodeDescription'],
                        `$filter=CodeGroup eq '${codeGroup}' and Catalog eq '${notifType.getItem(0).CatTypeDefects}'&$orderby=Code`
                    ).then(results => {
                        if (results._array.length > 0) {
                            let sortArr = results._array.sort((a, b) => Number(a.Code) - Number(b.Code));
                            let returnArr = sortArr.map(i => ({ 'ReturnValue': i.Code, 'DisplayValue': `${i.Code} - ${i.CodeDescription}` }));
                            targetList.setPickerItems(returnArr);
                        } return [];
                    });
                } else { // PM Notification, No Defect
                    return notification.NotificationItemCreateUpdateDamage(context);
                }
            });
        });
    } else {
        return notification.NotificationItemCreateUpdateDamage(context);
    }
}
