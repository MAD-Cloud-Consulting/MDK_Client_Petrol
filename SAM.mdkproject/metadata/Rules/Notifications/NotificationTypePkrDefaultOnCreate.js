import libCommon from '../Common/Library/CommonLibrary';
import libPersona from '../Persona/PersonaLibrary';
import ServiceNotificationTypesQueryOption from './Service/ServiceNotificationTypesQueryOption';

export default function NotificationTypePkrDefaultOnCreate(context) {

    let bindingObject = context.binding;

    if (bindingObject && bindingObject['@odata.type'] === '#sap_mobile.MyWorkOrderHeader') {
        let params = {
            OrderType: bindingObject.OrderType,
            PlanningPlant: bindingObject.PlanningPlant,
        };

        return getCorrespondingNotificationType(context, params);
    }

    return getDefaultNotificationType(context);
}

function getCorrespondingNotificationType(context, params) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', `OrderTypes(OrderType='${params.OrderType}', PlanningPlant='${params.PlanningPlant}')`, [], '').then(result => {
        if (result && result.length > 0) {
            let notifType = result.getItem(0).NotifType;
            if (notifType) {
                return notifType;
            } else {
                return getDefaultNotificationType(context);
            }
        } else {
            return getDefaultNotificationType(context);
        }
    });
}

function getDefaultServiceNotificationType(context) {
    return ServiceNotificationTypesQueryOption(context, 'NotifType').then(fsmNotifTypes => {
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'NotificationTypes', [], `$filter=${fsmNotifTypes}&$orderby=NotifType&$top=1`).then(types => {
            if (types && types.length > 0) {
                return types.getItem(0).NotifType;
            }
            
            return undefined;
        });
    });
}

function getDefaultNotificationType(context) {
    if (libPersona.isFieldServiceTechnician(context)) {
        return getDefaultServiceNotificationType(context);
    } else {
        return Promise.resolve(libCommon.getAppParam(context, 'NOTIFICATION', 'NotificationType'));
    }
}
