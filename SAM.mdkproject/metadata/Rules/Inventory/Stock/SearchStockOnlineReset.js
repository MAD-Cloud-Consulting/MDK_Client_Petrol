/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function SearchStockOnlineReset(context) {

    let plantListPicker = context.getPageProxy().getControl('FormCellContainer0').getControl('PlantListPicker');
    let storageLocationToLstPkr = context.getPageProxy().getControl('FormCellContainer0').getControl('StorageLocationListPicker');
    let matrialId = context.getPageProxy().getControl('FormCellContainer0').getControl('MatrialId');
    let matrialDescription = context.getPageProxy().getControl('FormCellContainer0').getControl('MatrialDescription');

    plantListPicker.setValue('');
    storageLocationToLstPkr.setValue('');
    matrialId.setValue('');
    matrialDescription.setValue('');
}
