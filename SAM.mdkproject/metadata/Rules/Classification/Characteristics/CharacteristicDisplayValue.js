/**
 * This function will query the object level characteristics to show them on the 
 * list view. It will first push them into an array with their respective unit of
 * measure and then pretty print them by simply joining them
 * 
 */

import charValue from './CharacteristicValue';
import Logger from '../../Log/Logger';
import parentEntityType from '../ClassificationParentEntityType';
import prettyPrint from './ClassificationCharacteristicsPrettyPrint';
/**
 * 
 * @param {*} context 
 * @param {*} withUOM Display UOM value?
 * @param {*} isLAMQuery Has this been called from the LAM screen?
 * @returns 
 */
export default function CharacteristicDisplayValue(context, withUOM=true, isLAMQuery=false) {
    var charValues = [];
    let property;

    if (isLAMQuery) {
        property = context.binding.InternCharacteristic;
    } else {
        property = context.binding.Characteristic.CharId;
    }
    if (parentEntityType(context) === 'Equipments') {
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyEquipClassCharValues', [], '$expand=Characteristic&$filter=EquipId eq \'' + context.evaluateTargetPathForAPI('#Page:-Previous').binding.EquipId + '\' and CharId eq \'' + property + '\'&$orderby=CharId,EquipId,CharValDesc asc,CharValFrom asc').then(function(results) {
            for (var i = 0; i < results.length; i++) {
                charValues.push(charValue(context, results.getItem(i), withUOM));
            }
            return prettyPrint(charValues);
        }).catch((error) => {
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryClassifications.global').getValue() , error);
            return charValues;
        });
    } else if (parentEntityType(context) === 'FunctionalLocations') {
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyFuncLocClassCharValues', [], '$expand=Characteristic&$filter=FuncLocIdIntern eq \'' + context.evaluateTargetPathForAPI('#Page:-Previous').binding.FuncLocIdIntern + '\' and CharId eq \'' + property + '\'&$orderby=CharId,FuncLocIdIntern,CharValDesc asc,CharValFrom asc').then(function(results) {
            for (var i = 0; i < results.length; i++) {
                charValues.push(charValue(context, results.getItem(i), withUOM));
            }
            return prettyPrint(charValues);
        }).catch((error) => {
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryClassifications.global').getValue() , error);
            return charValues;
        });
    }
    return charValues;
}
