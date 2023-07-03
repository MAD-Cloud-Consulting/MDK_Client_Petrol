
/**
 * If we have a multi-select Characteristic Value, the process is to delete all
 * ClassCharValue entries and recreate all new ones.  This has the side-effect
 * of invalidating the object bound to the page, causing the linked Characteristic
 * object to disappear. So, when the Characteristic Value Delete/Create process
 * finishes, we rebind the object to the page, restoring the linked Characteristic
 * object
 * 
 * @param {*} context 
 */
export default function CharacteristicValueDetailsOnReturning(context) {
    
    if (context.getClientData().didUpdateEntity) {
        return rebindPageObject(context).then(() => {
            
            context.getControl('SectionedTable')._context.binding = context._context.binding;
            context.getControl('SectionedTable').redraw();
            // Page has been updated
            context.getClientData().didUpdateEntity = false;
        });
    }
}

function rebindPageObject(context) {

    let entityType = context.getBindingObject()['@odata.type'];
    let entitySet;
    let objectKey;
    let charId;
    if (entityType.includes('Value')) {
        objectKey = context.binding.ObjectKey;
        charId = context.binding.CharId;
        if (entityType === '#sap_mobile.MyEquipClassCharValue') {
            entitySet = 'MyEquipClassCharValues';
        } else if (entityType === '#sap_mobile.MyFuncLocClassCharValue') {
            entitySet = 'MyFuncLocClassCharValues';
        }
    } else if (entityType === '#sap_mobile.ClassCharacteristic' ) {
        let parent = context.evaluateTargetPathForAPI('#Page:-Previous').binding;
        objectKey = parent.ObjectKey;
        charId = context.binding.Characteristic.CharId;
        if (parent['@odata.type'].includes('Equip')) {
            entitySet = 'MyEquipClassCharValues';
        } else {
            entitySet = 'MyFuncLocClassCharValues';
        }
    }
    
    return context.read('/SAPAssetManager/Services/AssetManager.service', entitySet, [], '$filter=ObjectKey eq \'' + objectKey + '\' and CharId eq \'' + charId + '\'' + '&$expand=Characteristic/ClassCharacteristics/Characteristic/CharacteristicValues,CharValCode_Nav&$orderby=CharId').then(function(results) {
        if (results.getItem(0)) {
            context._context.binding = results.getItem(0);
            return true;
        } else {
            return false;
        }
    });

}
