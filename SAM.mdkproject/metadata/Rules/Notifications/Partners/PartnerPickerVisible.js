import NotificationTypeLstPkrDefault from '../NotificationTypePkrDefault';

/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function PartnerPickerVisible(context) {
    return context.count('/SAPAssetManager/Services/AssetManager.service', 'NotifPartnerDetProcs', `$orderby=PartnerFunction&$filter=NotifType eq '${NotificationTypeLstPkrDefault(context)}' and PartnerIsMandatory eq 'X' and sap.entityexists(PartnerFunction_Nav)`).then(result => {
        if (result > 1) {
            if (context.getName() === 'PartnerPicker1')
                return true;
            else if (context.getName() === 'PartnerPicker2')
                return true;
            else
                return false;
        } else if (result > 0) {
            if (context.getName() === 'PartnerPicker1')
                return true;
            else if (context.getName() === 'PartnerPicker2')
                return false;
            else
                return false;
        } else {
            return false;
        }
    });
}
