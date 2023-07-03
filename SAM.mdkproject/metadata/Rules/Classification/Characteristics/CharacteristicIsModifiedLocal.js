/**
 * This function will query the object level characteristics and find if any of 
 * them are local and push the sync icon
 * 
 */

import Logger from '../../Log/Logger';
import parentEntityType from '../ClassificationParentEntityType';
import isAndroid from '../../Common/IsAndroid';
export default function CharacteristicIsModifiedLocal(context) {
    if (parentEntityType(context) === 'Equipments') {
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyEquipClassCharValues', [], '$filter=EquipId eq \'' + context.evaluateTargetPathForAPI('#Page:-Previous').binding.EquipId + '\' and CharId eq \'' + context.binding.Characteristic.CharId + '\'&$orderby=CharId,EquipId').then(function(results) {
            for (var i = 0; i < results.length; i++) {
                if (results.getItem(i)['@sap.isLocal']) {
                    return [isAndroid(context) ? '/SAPAssetManager/Images/syncOnListIcon.android.png' : '/SAPAssetManager/Images/syncOnListIcon.png'];
                }
            }
            return [];
        }).catch((error) => {
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryClassifications.global').getValue() , error);
            return [];
        });
    } else if (parentEntityType(context) === 'FunctionalLocations') {
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyFuncLocClassCharValues', [], '$filter=FuncLocIdIntern eq \'' + context.evaluateTargetPathForAPI('#Page:-Previous').binding.FuncLocIdIntern + '\' and CharId eq \'' + context.binding.Characteristic.CharId + '\'&$orderby=CharId,FuncLocIdIntern').then(function(results) {
            for (var i = 0; i < results.length; i++) {
                if (results.getItem(i)['@sap.isLocal']) {
                    return [isAndroid(context) ? '/SAPAssetManager/Images/syncOnListIcon.android.png' : '/SAPAssetManager/Images/syncOnListIcon.png'];
                }
            }
            return [];
        }).catch((error) => {
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryClassifications.global').getValue() , error);
            return [];
        });
    }
    return [];
}



