export default function IsMaterialSerializedDuringCreate(context) {

    try {
        //Check if the currently selected plant and material combination is serialized
        let material = context.getPageProxy().getControl('FormCellContainer').getControl('MatrialListPicker').getValue()[0].ReturnValue;
        let plant;
        
        if (context.getPageProxy().getControl('FormCellContainer').getControl('PlantLstPkr')) {
            plant = context.getPageProxy().getControl('FormCellContainer').getControl('PlantLstPkr').getValue()[0].ReturnValue;
        } else {
            plant = context.getPageProxy().getControl('FormCellContainer').getControl('ItemPlantTitle').getValue();
        }
        let query = "$filter=MaterialNum eq '" + material + "' and Plant eq '" + plant + "'";

        if (material && plant) {
            return context.read('/SAPAssetManager/Services/AssetManager.service', 'MaterialPlants', ['SerialNumberProfile'], query).then(function(results) { 
                if (results && results.length > 0) {
                    let row = results.getItem(0);
                    if (row.SerialNumberProfile) {
                        return true;
                    }
                }
                return false;
            });
        }
        return Promise.resolve(false); //Nothing to check
    } catch (error) {
        return Promise.resolve(false);
    }
}
