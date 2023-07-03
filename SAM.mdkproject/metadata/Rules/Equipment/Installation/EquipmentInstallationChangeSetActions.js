/**
* Execute actions for installing equipment and assigning status according to the object to which the equipment is installed
* @param {IClientAPI} context
*/
export default function EquipmentInstallationChangeSetActions(context) {
    return context.executeAction('/SAPAssetManager/Actions/Equipment/Installation/EquipmentInstallation.action')
    .then(() => {
        const action = context.binding['@odata.type'] === '#sap_mobile.MyEquipment' ? 
        '/SAPAssetManager/Actions/Equipment/Installation/SetAllocated.action' :  
        '/SAPAssetManager/Actions/Equipment/Installation/SetInstall.action';

        return context.executeAction(action);
    });
}
