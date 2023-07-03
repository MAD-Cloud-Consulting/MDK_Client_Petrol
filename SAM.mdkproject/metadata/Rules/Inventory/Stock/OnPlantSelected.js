/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function OnPlantSelected(context) {

    if (context.getValue().length > 0) {
        let value = context.getValue()[0].ReturnValue;
        let storageLocationToLstPkr = context.getPageProxy().getControl('FormCellContainer0').getControl('StorageLocationListPicker');
        let storageLocationToSpecifier = storageLocationToLstPkr.getTargetSpecifier();
        storageLocationToSpecifier.setQueryOptions(`$filter=Plant eq '${value}'&$orderby=StorageLocation`);
        storageLocationToSpecifier.setEntitySet('StorageLocations');
        storageLocationToSpecifier.setService('/SAPAssetManager/Services/AssetManager.service');
        storageLocationToLstPkr.setEditable(true);
        storageLocationToLstPkr.setValue('');
        storageLocationToLstPkr.setTargetSpecifier(storageLocationToSpecifier);
        storageLocationToLstPkr.redraw();
    }
}
