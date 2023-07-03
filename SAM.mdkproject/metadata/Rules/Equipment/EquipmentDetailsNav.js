import { EquipmentLibrary as libEquipment } from './EquipmentLibrary';
import Logger from '../Log/Logger';
import userFeaturesLib from '../UserFeatures/UserFeaturesLibrary';

export default function EquipmentDetailsNav(context) {
    let pageProxy = context.getPageProxy();
    let actionContext = pageProxy.getActionBinding();

    let queryOpts = libEquipment.equipmentDetailsQueryOptions();
    if (userFeaturesLib.isFeatureEnabled(context,context.getGlobalDefinition('/SAPAssetManager/Globals/Features/AssetCentral.global').getValue())) {
        queryOpts = libEquipment.equipmentDetailsWithAssetCentralQueryOptions();
    }
    //Rebind the necessary equipment data selected from the list
    return context.read('/SAPAssetManager/Services/AssetManager.service', actionContext['@odata.readLink'], [], queryOpts).then(Equipment => {
        pageProxy.setActionBinding(Equipment.getItem(0));
        return context.executeAction('/SAPAssetManager/Actions/Equipment/EquipmentDetailsNav.action');
    }, error => {
        /**Implementing our Logger class*/
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryEquipment.global').getValue(), error);
    });
}
