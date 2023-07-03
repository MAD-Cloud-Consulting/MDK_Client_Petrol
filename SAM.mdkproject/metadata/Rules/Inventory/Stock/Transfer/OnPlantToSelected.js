/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function OnPlantToSelected(context) {
    let storageLocationToLstPkr = context.getPageProxy().getControl('FormCellContainer').getControl('StorageLocationToListPicker');
    if (context.getValue().length > 0) {
        let value = context.getValue()[0].ReturnValue;
        let movementTypeLstPkr = context.getPageProxy().getControl('FormCellContainer').getControl('MovementTypePicker');
        if (movementTypeLstPkr.getValue().length > 0) {
            let movementTypeValue = movementTypeLstPkr.getValue()[0].ReturnValue;
            if (movementTypeValue === '301') {
                let storageLocationToSpecifier = storageLocationToLstPkr.getTargetSpecifier();
                storageLocationToSpecifier.setQueryOptions(`$filter=Plant eq '${value}'&$orderby=StorageLocation`);
                storageLocationToSpecifier.setEntitySet('StorageLocations');
                storageLocationToSpecifier.setService('/SAPAssetManager/Services/AssetManager.service');
                storageLocationToLstPkr.setEditable(true);
                storageLocationToLstPkr.setTargetSpecifier(storageLocationToSpecifier);
                storageLocationToLstPkr.redraw();
            }
        }
    } else {
        storageLocationToLstPkr.setEditable(false);
    }
    storageLocationToLstPkr.setValue('');
    storageLocationToLstPkr.redraw();
}
