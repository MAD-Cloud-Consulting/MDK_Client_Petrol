/**
   * Get the characteristics values of any data type but for "Multiple Value" type of Input
   * The first read get all the characterisitcs belong to particular entity set and store it
   * in a query option.  In addition it is also checking if the value relation so that it can reference
   * appropriate property. The second read query the Class which has all possible characteristic
   * and filter out the one which belong to particular entity.
   * 
   * @param {} context
   * 
   * @returns {string} returns the sorted array of values with all the characteristic minus 
   * the characterisitcs that are already being assigned to the entity.
   * 
   */
import Logger from '../../Log/Logger';
import libCom from '../../Common/Library/CommonLibrary';
import sorter from '../Characteristics/CharacteristicSorter';
import assembleDisplayValues from './CharacteristicAssembleDisplayValue';
import assembleReturnValues from './CharacteristicAssembleReturnValue';
import entityDetails from './CharacteristicEntityDetails';
import charValue from '../Characteristics/Character/CharacteristicCharacterDescription';
export default function CharacteristicMultiValues(context) {
    var jsonResult = [];
    let controlName = libCom.getStateVariable(context,'VisibleControlFrom');
    if (controlName ==='CurrencyMultipleValue' || controlName ==='CharacterMultipleValue' || controlName ==='NumberMultipleValue') {
        let queryOptions = '';
        let entity = entityDetails(context);
        let idType = entity[0].IDType;
        let entityType = entity[0].EntityName;
        context.binding.id = entity[0].ID;
        let numberOfDecimals = context.binding.Characteristic.NumofDecimal;
        return context.read('/SAPAssetManager/Services/AssetManager.service', entityType, [], '$filter=(CharId eq \'' + context.binding.CharId + '\' and '+ idType +' eq \'' + context.binding.id + '\')&$orderby=CharId,' + idType).then(function(results) {
            for (var i = 0; i < results.length; i++) {
                let obj = results.getItem(i);
                if (controlName === 'CharacterMultipleValue') {
                    queryOptions = queryOptions + ' and CharValue ne \'' + obj.CharValue + '\'' ;
                    jsonResult.push(
                        {
                            'DisplayValue': `${charValue(obj)}`,
                            'ReturnValue': obj.CharValue,
                        });
                } else {
                    queryOptions = queryOptions + ' and CharValFrom ne ' + (obj.ValueRel === '6' || obj.ValueRel === '7' ? obj.CharValTo : obj.CharValFrom);
                    jsonResult.push(
                        {
                            'DisplayValue': assembleDisplayValues(obj, obj.ValueRel,  context.formatNumber(obj.CharValFrom,'', {maximumFractionDigits:numberOfDecimals}), context.formatNumber(obj.CharValTo,'', {maximumFractionDigits:numberOfDecimals}), 'MultipleValues'),
                            'ReturnValue': assembleReturnValues(obj, obj.ValueRel, obj.CharValFrom.toString(),  obj.CharValTo.toString()),
                        });
                }
            }
            return context.read('/SAPAssetManager/Services/AssetManager.service', 'ClassCharacteristicValues', [], '$filter=(CharId eq \'' + context.binding.CharId + '\'' + queryOptions + ')').then(function(result) {
                for (var k = 0; k < result.length; k++) {
                    let resultObj = result.getItem(k);
                    if (controlName === 'CharacterMultipleValue') {
                        jsonResult.push(
                            {
                                'DisplayValue': `${charValue(resultObj)}`,
                                'ReturnValue': resultObj.CharValue,
                            });
                    } else {
                        jsonResult.push(
                            {
                                'DisplayValue': assembleDisplayValues(context, resultObj.ValueRel, context.formatNumber(resultObj.CharValFrom,'', {maximumFractionDigits:numberOfDecimals}), context.formatNumber(resultObj.CharValTo,'', {maximumFractionDigits:numberOfDecimals})),
                                'ReturnValue': assembleReturnValues(context, resultObj.ValueRel, resultObj.CharValFrom,  resultObj.CharValTo, 'MultipleValues'),
                            });
                    }
                    
                }
                return jsonResult.sort(sorter);
            }).catch((error) => {
                 Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryClassifications.global').getValue() , 'Cannot read entity set Classficiation CharacteristicMultiValues' + error);
                 return jsonResult;
            });
        }).catch((error) => {
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryClassifications.global').getValue() , 'Cannot read entity set Classficiation CharacteristicMultiValues' + error);
            return jsonResult;
        });
    } else {
         Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryClassifications.global').getValue() , 'Not a valid EntityType for Classification');
         return jsonResult;
    }
}
