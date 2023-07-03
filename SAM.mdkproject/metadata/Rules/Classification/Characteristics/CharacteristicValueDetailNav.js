import ComLib from '../../Common/Library/CommonLibrary';
import Logger from '../../Log/Logger';

export default function CharacteristicValueDetailNav(context) {
    //Set the global TransactionType variable to UPDATE
    ComLib.setOnCreateUpdateFlag(context, 'UPDATE');
    let entityType = context.binding['@odata.type'];
    let entitySet = '';
    if (entityType === '#sap_mobile.MyEquipClass') {
        entitySet = 'MyEquipClassCharValues';
    } else if (entityType === '#sap_mobile.MyFuncLocClass') {
        entitySet = 'MyFuncLocClassCharValues';
    }
    return context.read('/SAPAssetManager/Services/AssetManager.service', entitySet, [], '$filter=ObjectKey eq \'' + context.binding.ObjectKey + '\' and CharId eq \'' + context.getPageProxy().getActionBinding().Characteristic.CharId + '\'' + '&$expand=Characteristic/ClassCharacteristics/Characteristic/CharacteristicValues,CharValCode_Nav&$orderby=CharId').then(function(results) {
        if (results.getItem(0)) {
            let actionBinding = results.getItem(0);
            actionBinding.InternClassNum = context.binding.InternClassNum;
            context.getPageProxy().setActionBinding(actionBinding);
            return context.executeAction('/SAPAssetManager/Actions/Classification/Characteristics/CharacteristicValueDetailNav.action');
        }
        return context.executeAction('/SAPAssetManager/Actions/Classification/Characteristics/CharacteristicValueDetailNav.action');
    }).catch((error) => {
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryClassifications.global').getValue() , error);
    });
}
