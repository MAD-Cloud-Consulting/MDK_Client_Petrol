import libCommon from '../../Common/Library/CommonLibrary';

export default function NotificationCreateUpdatePartnerType(context, bindingObject, defaultNotifType = '') {
    const notifType = libCommon.IsOnCreate(context) ? defaultNotifType : bindingObject.NotificationType;

    return context.read('/SAPAssetManager/Services/AssetManager.service', 'NotifPartnerDetProcs', [], `$orderby=PartnerFunction&$expand=PartnerFunction_Nav&$top=2&$filter=NotifType eq '${notifType}' and PartnerIsMandatory eq 'X' and sap.entityexists(PartnerFunction_Nav)`).then(result => {
        if (result.length > 0) {
            if (result.length > 1) {
                libCommon.setStateVariable(context,'partnerType1', result.getItem(0).PartnerFunction_Nav.PartnerFunction);
                libCommon.setStateVariable(context,'partnerType2', result.getItem(1).PartnerFunction_Nav.PartnerFunction);
            }
            libCommon.setStateVariable(context,'partnerType1', result.getItem(0).PartnerFunction_Nav.PartnerFunction);
            libCommon.setStateVariable(context,'partnerType2', '');
        } else {
            libCommon.setStateVariable(context,'partnerType1', '');
            libCommon.setStateVariable(context,'partnerType2', '');
        }
    });
}
