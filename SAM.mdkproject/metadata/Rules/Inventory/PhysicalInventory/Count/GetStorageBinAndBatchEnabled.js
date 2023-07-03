/**
 * Return an array with storage bin/batch enabled/valuation enabled for handling screen fields
 * @param {*} context 
 * @returns 
 */
export default function GetStorageBinAndBatchEnabled(context) {
    let emptyArray = ['', false, false];

    try {
        //Get the storage bin/batch/valuated for this plant/material/sloc
        let material = context.getPageProxy().getControl('FormCellContainer').getControl('MatrialListPicker').getValue()[0].ReturnValue;
        let plant;
        if (context.getPageProxy().getControl('FormCellContainer').getControl('PlantLstPkr')) {
            plant = context.getPageProxy().getControl('FormCellContainer').getControl('PlantLstPkr').getValue()[0].ReturnValue;
        } else {
            plant = context.getPageProxy().getControl('FormCellContainer').getControl('ItemPlantTitle').getValue();
        }
        let sloc;
        if (context.getPageProxy().getControl('FormCellContainer').getControl('StorageLocationPicker')) {
            sloc = context.getPageProxy().getControl('FormCellContainer').getControl('StorageLocationPicker').getValue()[0].ReturnValue;
        } else {
            sloc = context.getPageProxy().getControl('FormCellContainer').getControl('ItemStorageLocationTitle').getValue();
        }
        let query = "$filter=MaterialNum eq '" + material + "' and Plant eq '" + plant + "' and StorageLocation eq '" + sloc + "'";
        query += '&$expand=MaterialPlant';

        if (material && plant && sloc) {
            return context.read('/SAPAssetManager/Services/AssetManager.service', 'MaterialSLocs', ['StorageBin','BatchIndicator','MaterialPlant/ValuationCategory'], query).then(function(results) { 
                if (results && results.length > 0) {
                    let row = results.getItem(0);
                    let val = false;
                    if (row.MaterialPlant && row.MaterialPlant.ValuationCategory) {
                        val = true;
                    }
                    return [row.StorageBin, (row.BatchIndicator === 'X'), val]; //Storage bin/batch enabled/valuation enabled
                }
                return emptyArray;
            });
        }
        return Promise.resolve(emptyArray); //Nothing to check
    } catch (error) {
        return Promise.resolve(emptyArray);
    }
}
