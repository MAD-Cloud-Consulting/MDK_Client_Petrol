import Logger from '../Log/Logger';

export default function HierarcyFunctionalLocationDetailsNav(context) {

    let floc = context.getControls('HierarchyExtensionControl')[0].binding;

    return context.read('/SAPAssetManager/Services/AssetManager.service', floc['@odata.readLink'], [], '$expand=WorkOrderHeader').then(flocResult => {
        context.setActionBinding(flocResult.getItem(0));
        return context.executeAction('/SAPAssetManager/Actions/FunctionalLocation/FunctionalLocationDetailsNav.action');
    }, error => {
        /**Implementing our Logger class*/
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryEquipment.global').getValue(), error);
    });
}
