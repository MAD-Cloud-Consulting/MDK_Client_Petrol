
export default function BatchPickerVisible(context) {
    let plant = context.getPageProxy().binding.Plant;
    let materialNum = context.getPageProxy().binding.MaterialNum;
   
    if (plant && materialNum) {
        let query = `$filter=Plant eq '${plant}' and MaterialNum eq '${materialNum}'`;
    
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'MaterialPlants', [], query).then(result => {
            if (result && result.length === 1) {
                let material = result.getItem(0);
                let isBatch = material.BatchIndicator === 'X';
                return isBatch;
            }
            return false;
        });
    } 
    return false;
}
