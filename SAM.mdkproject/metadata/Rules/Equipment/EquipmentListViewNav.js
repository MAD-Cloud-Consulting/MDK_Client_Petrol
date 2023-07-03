import Logger from '../Log/Logger';

export default function EquipmentListViewNav(context) {
    Logger.info(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryEquipment.global').getValue(), 'EquipmentListViewNav called');
    return context.executeAction('/SAPAssetManager/Actions/Equipment/EquipmentListViewNav.action');
}
