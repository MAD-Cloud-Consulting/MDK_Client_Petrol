/**
 * This function will assemble all the characteristics from the 
 * object level and assemble them into correct 
 * @param {IListPickerFormCellTargetProxy} context
 * @returns jsonResult: The array of all the characteristics
*/

import Logger from '../../Log/Logger';
import libCom from '../../Common/Library/CommonLibrary';
import assembleReturnValue from './CharacteristicAssembleReturnValue';
export default function CharacteristicAssembleReturnMultipleValue(context) {
    var jsonResult = [];
    var idType;
    let entityType = context.binding['@odata.type'];
    let charCounter = [];
    if (entityType === '#sap_mobile.MyEquipClassCharValue') {
        entityType = 'MyEquipClassCharValues';
        context.binding.id = context.binding.EquipId;
        idType = 'EquipId';
    } else if (entityType === '#sap_mobile.MyFuncLocClassCharValue') {
        entityType = 'MyFuncLocClassCharValues';
        context.binding.id = context.binding.FuncLocIdIntern;
        idType = 'FuncLocIdIntern';
    } else if (entityType === '#sap_mobile.ClassCharacteristic') {
        Logger.info(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryClassifications.global').getValue() , 'No Default values to show');
        return charCounter;
    }
    let controlName = libCom.getStateVariable(context,'VisibleControlFrom');
    if (controlName ==='CurrencyMultipleValue' || controlName ==='CharacterMultipleValue' || controlName ==='NumberMultipleValue' || controlName === 'TimeMultipleValue') {
        return context.read('/SAPAssetManager/Services/AssetManager.service', entityType, [], '$filter=(CharId eq \'' + context.binding.CharId + '\' and '+ idType +' eq \'' + context.binding.id + '\')&$orderby=CharId,' + idType).then(function(results) {
            for (var i = 0; i < results.length; i++) {
                let obj = results.getItem(i);
                if (controlName === 'CharacterMultipleValue') {
                    jsonResult.push(obj.CharValue);
                } else {
                    jsonResult.push(assembleReturnValue(context, obj.ValueRel, obj.CharValFrom, obj.CharValTo));
                }
                charCounter.push(obj.CharValCounter);
            }
            //* We need to set this variable so we can know how many items we have to delete when user changes the list picker items in Delete.action
            libCom.setStateVariable(context,'ClassCharValues', results.length);
            libCom.setStateVariable(context,'ExistingCounters', charCounter);
            return jsonResult;
        });
    }  else {
        return charCounter;
    } 
}
