import libVal from '../../Common/Library/ValidationLibrary';

/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function StockPlantDescription(context) {
    if (!libVal.evalIsEmpty(context.binding.Plant)) {
        return context.read(
            '/SAPAssetManager/Services/AssetManager.service',
            `Plants('${context.binding.Plant}')`,
            [],
            '$select=PlantDescription').then(result => {
                if (result && result.length > 0) {
                    //Grab the first row (should only ever be one row)
                    let row = result.getItem(0);
                    return context.binding.Plant + ' - ' + row.PlantDescription;
                }
                return context.binding.Plant;
            });
    }
}
