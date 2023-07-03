import { EquipmentLibrary as libEquipment } from './EquipmentLibrary';
import Logger from '../Log/Logger';

export default function HierarcyEquipmentDetailsNav(context) {
    let actionContext = context.getControls('HierarchyExtensionControl')[0].binding;

    //Rebind the necessary equipment data selected from the list
    return context.read('/SAPAssetManager/Services/AssetManager.service', actionContext['@odata.readLink'], [], libEquipment.equipmentDetailsQueryOptions()).then(Equipment => {
        context.setActionBinding(Equipment.getItem(0));
        return context.executeAction('/SAPAssetManager/Actions/Equipment/EquipmentDetailsNav.action');
    }, error => {
        /**Implementing our Logger class*/
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryEquipment.global').getValue(), error);
    });
}
