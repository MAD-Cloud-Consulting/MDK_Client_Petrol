
import libCom from '../../Common/Library/CommonLibrary';

export default function LAMValueUpdate(context) {
    let entityType = context.getBindingObject()['@odata.type'];
    let entitySet = '';
    const objectKey = context.binding.ObjectKey;
    const charId = context.binding.CharId;
    const controls = libCom.getControlDictionaryFromPage(context);
    const selectedValDesc = libCom.getListPickerValue(controls.ValueLstPkr.getValue());

    if (entityType === '#sap_mobile.MyEquipClassCharValue') {
        entitySet = 'MyEquipClassCharValues';
    } else if (entityType === '#sap_mobile.MyFuncLocClassCharValue') {
        entitySet = 'MyFuncLocClassCharValues';
    }

    return context.read('/SAPAssetManager/Services/AssetManager.service', entitySet, [], '$filter=ObjectKey eq \'' + objectKey + '\' and CharId eq \'' + charId + '\'' + '&$expand=Characteristic/ClassCharacteristics/Characteristic/CharacteristicValues,CharValCode_Nav&$orderby=CharId').then(function(results) {
        for (let i = 0; i < results.length; i++) {
            if (results.getItem(i).CharValDesc === selectedValDesc) {
                context._context.binding = results.getItem(i);
                return true;
            }
        }
        return false;
    });
}
