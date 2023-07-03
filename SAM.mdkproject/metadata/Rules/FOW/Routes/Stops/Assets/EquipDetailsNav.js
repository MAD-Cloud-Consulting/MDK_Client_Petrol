import { EquipmentLibrary as libEquipment } from '../../../../Equipment/EquipmentLibrary';
import Logger from '../../../../Log/Logger';

export default function EquipDetailsNav(context) {
    let pageProxy = context.getPageProxy();
    let actionContext = pageProxy.getActionBinding();
    

    //Rebind the necessary equipment data selected from the list
    return context.read('/SAPAssetManager/Services/AssetManager.service', actionContext['@odata.readLink'] + '/Equip', [], libEquipment.equipmentDetailsQueryOptions()).then(Equipment => {
        pageProxy.setActionBinding(Equipment.getItem(0));
        return context.executeAction('/SAPAssetManager/Actions/Equipment/EquipmentDetailsNav.action');
    }, error => {
        /**Implementing our Logger class*/
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryEquipment.global').getValue(), error);
    });
}
