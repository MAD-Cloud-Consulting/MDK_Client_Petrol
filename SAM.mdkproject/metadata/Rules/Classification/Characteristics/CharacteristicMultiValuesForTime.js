/**
   * Get the characteristics values of only "TIME" data type with "Multiple Value" as a type
   * of Input. The first read get all the characterisitcs belong to particular entity set and store it
   * in a query option. In addition it is also checking if the value relation so that it can reference
   * appropriate property. The second read query the Class which has all possible characteristic
   * and filter out the one which belong to particular entity.
   * 
   * @param {} context
   * 
   * @returns {string} returns the sorted array of values with all the characteristic minus 
   * the characterisitcs that are already being assigned to the entity. The values are
   * passed to a function which will convert the time from "100300" to "10:03:00 AM"
   * 
   */
import Logger from '../../Log/Logger';
import libCom from '../../Common/Library/CommonLibrary';
import timeDisplayValue from '../Characteristics/Time/CharacteristicsTimeDisplayValue';
import sorter from '../Characteristics/CharacteristicSorter';
import assembleDisplayValues from './CharacteristicAssembleDisplayValue';
import assembleReturnValues from './CharacteristicAssembleReturnValue';
import entityDetails from './CharacteristicEntityDetails';

export default function CharacteristicMultiValuesForTime(context) {
    let controlName = libCom.getStateVariable(context,'VisibleControlFrom');
    if (controlName === 'TimeMultipleValue') {
        let queryOptions = '';
        var jsonResult = [];
        let entity = entityDetails(context);
        let idType = entity[0].IDType;
        let entityType = entity[0].EntityName;
        context.binding.id = entity[0].ID;
        return context.read('/SAPAssetManager/Services/AssetManager.service', entityType, [], '$filter=(CharId eq \'' + context.binding.CharId + '\' and '+ idType +' eq \'' + context.binding.id + '\')&$orderby=CharId,' + idType).then(function(results) {
            for (var i = 0; i < results.length; i++) {
                let obj = results.getItem(i);
                queryOptions = queryOptions + ' and CharValFrom ne ' + (obj.ValueRel === '6' || obj.ValueRel === '7' ? obj.CharValTo : obj.CharValFrom);
                jsonResult.push(
                    {
                        'DisplayValue': assembleDisplayValues(obj, obj.ValueRel, timeDisplayValue(context, obj.CharValFrom), timeDisplayValue(context, obj.CharValTo)),
                        'ReturnValue': assembleReturnValues(obj, obj.ValueRel, parseInt(obj.CharValFrom), parseInt(obj.CharValTo)),
                    });
            }
            return context.read('/SAPAssetManager/Services/AssetManager.service', 'ClassCharacteristicValues', [], '$filter=(CharId eq \'' + context.binding.CharId + '\'' + queryOptions + ')').then(function(result) {
                for (var k = 0; k < result.length; k++) {
                    let resultObj = result.getItem(k);
                    jsonResult.push(
                        {
                                'DisplayValue': assembleDisplayValues(context, resultObj.ValueRel, timeDisplayValue(context, resultObj.CharValFrom),timeDisplayValue(context, resultObj.CharValTo)),
                                'ReturnValue': assembleReturnValues(context, resultObj.ValueRel, parseInt(resultObj.CharValFrom), parseInt(resultObj.CharValTo), 'MultipleValues'),
                        });
                }
                return jsonResult.sort(sorter);
            }).catch((error) => {
                Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryClassifications.global').getValue() , 'Cannot read entity set Classficiation CharacteristicMultiValuesForTime' + error);
                return jsonResult;
            });
        }).catch((error) => {
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryClassifications.global').getValue() , 'Cannot read entity set Classficiation CharacteristicMultiValuesForTime' + error);
            return jsonResult;
        });
    } else {
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryClassifications.global').getValue() , 'Not a valid EntityType for Classification');
        return jsonResult;
    }
}
