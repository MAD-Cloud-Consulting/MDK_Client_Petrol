
export default function StockLookUpPlantFilterQuery(context) {
    // let clientData = context.evaluateTargetPath('#Page:InventorySearchFilterPage').getClientData();
    // return clientData.PlantQueryOptions;
    return context.read(
        '/SAPAssetManager/Services/AssetManager.service',
        'MaterialSLocs',
        ['Plant'],
        '$orderby=Plant').then(result => {
            let plants = [];
            if (result && result.length > 0) {
                for (var i = 0; i < result.length; i++) {
                    plants.push(result.getItem(i).Plant);
                }
                const uniqueSet = new Set(plants.map(item => JSON.stringify(item)));
                let finalResult = [...uniqueSet].map(item => JSON.parse(item));
                let queryOptions = '';
                if (finalResult && finalResult.length > 0) {
                    for (var k = 0; k < finalResult.length; k++) {
                        if (k === 0) {
                            queryOptions = `$filter=(Plant eq '${finalResult[k]}'`;
                        } else {
                            queryOptions = queryOptions + ` or Plant eq '${finalResult[k]}'`;
                        }
                    }
                    queryOptions = queryOptions + ')';
                }
                return queryOptions.trim();
            }
            return '';
        });
    
}
