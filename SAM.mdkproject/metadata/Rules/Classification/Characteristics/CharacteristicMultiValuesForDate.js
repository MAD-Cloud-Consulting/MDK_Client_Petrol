/**
   * Get the characteristics values of only "DATE" data type with "Multiple Value" as a type
   * of Input. The first read get all the characterisitcs belong to particular entity set and store it
   * in a query option. In addition it is also checking if the value relation so that it can reference
   * appropriate property. The second read query the Class which has all possible characteristic
   * and filter out the one which belong to particular entity.
   * 
   * @param {} context
   * 
   * @returns {string} returns the sorted array of values with all the characteristic minus 
   * the characterisitcs that are already being assigned to the entity. The values are
   * passed to a function which will convert the date from "01012018" to "Jan 1, 2018"
   * 
   */
import Logger from '../../Log/Logger';
import libCom from '../../Common/Library/CommonLibrary';
import dateDisplayValue from '../Characteristics/Date/CharacteristicsDateDisplayValue';
import dateReturnValue from '../Characteristics/Date/CharacteristicsDateReturnValue';
import sorter from '../Characteristics/CharacteristicSorter';
import assembleDisplayValues from './CharacteristicAssembleDisplayValue';
import assembleReturnValues from '../Characteristics/Date/CharacteristicAssembleReturnValueForDate';
import entityDetails from './CharacteristicEntityDetails';
export default function CharacteristicMultiValuesForDate(context) {
    let controlName = libCom.getStateVariable(context,'VisibleControlFrom');
    if (controlName === 'DateMultipleValue') {
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
                        'DisplayValue': assembleDisplayValues(obj, obj.ValueRel, dateDisplayValue(context, obj.CharValFrom), dateDisplayValue(context, obj.CharValTo)),
                        'ReturnValue': assembleReturnValues(context, obj.ValueRel, parseInt(dateReturnValue(obj.CharValFrom)), parseInt(dateReturnValue(obj.CharValTo))),
                    });
            }
            return context.read('/SAPAssetManager/Services/AssetManager.service', 'ClassCharacteristicValues', [], '$filter=(CharId eq \'' + context.binding.CharId + '\'' + queryOptions + ')').then(function(result) {
                for (var k = 0; k < result.length; k++) {
                    let resultObj = result.getItem(k);
                    jsonResult.push(
                        {
                            'DisplayValue': assembleDisplayValues(context, resultObj.ValueRel, dateDisplayValue(context, resultObj.CharValFrom), dateDisplayValue(context, resultObj.CharValTo)),
                            'ReturnValue': assembleReturnValues(context,resultObj.ValueRel, parseInt(dateReturnValue(resultObj.CharValFrom)),parseInt(dateReturnValue(resultObj.CharValTo)), 'MultipleValues'),
                        });
                }
                return jsonResult.sort(sorter);
            }).catch((error) => {
                Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryClassifications.global').getValue() , 'Cannot read entity set Classficiation CharacteristicMultiValuesForDate' + error);
                return jsonResult;
            });
        }).catch((error) => {
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryClassifications.global').getValue() , 'Cannot read entity set Classficiation CharacteristicMultiValuesForDate' + error);
            return jsonResult;
        });
    } else {
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryClassifications.global').getValue() , 'Not a valid EntityType for Classification');
        return jsonResult;
    }
    
}

