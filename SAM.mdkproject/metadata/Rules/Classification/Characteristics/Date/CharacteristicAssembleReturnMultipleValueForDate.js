import libCom from '../../../Common/Library/CommonLibrary';
import Logger from '../../../Log/Logger';
import assembleReturnMultipleValue from './CharacteristicAssembleReturnValueForDate';
export default function CharacteristicAssembleReturnMultipleValueForDate(context) {
    var jsonResult = [];
    var idType;
    let charCounter = [];
    let entityType = context.binding['@odata.type'];
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
         return jsonResult;
    }
    let controlName = libCom.getStateVariable(context,'VisibleControlFrom');
    if (controlName ==='DateMultipleValue') {
        return context.read('/SAPAssetManager/Services/AssetManager.service', entityType, [], '$filter=(CharId eq \'' + context.binding.CharId + '\' and '+ idType +' eq \'' + context.binding.id + '\')&$orderby=CharId,' + idType).then(function(results) {
            for (var i = 0; i < results.length; i++) {
                let obj = results.getItem(i);
                jsonResult.push(assembleReturnMultipleValue(context, obj.ValueRel, obj.CharValFrom, obj.CharValTo));
                charCounter.push(obj.CharValCounter);
            }
            libCom.setStateVariable(context,'ClassCharValues', results.length);
            libCom.setStateVariable(context,'ExistingCounters', charCounter);

            return jsonResult;
        });
    }
}
