
export default function StockLookUpStorageLocationPickerItems(context) {
    // let clientData = context.evaluateTargetPath('#Page:InventorySearchFilterPage').getClientData();
    // return clientData.StorageLocationQueryOptions;
    return context.read(
        '/SAPAssetManager/Services/AssetManager.service',
        'StorageLocations',
        ['StorageLocation','StorageLocationDesc'],
        '$orderby=StorageLocation').then(result => {
            let storageLocations = [];
            var jsonResult = [];
            if (result && result.length > 0) {
                for (var i = 0; i < result.length; i++) {
                    storageLocations.push(result.getItem(i).StorageLocation);
                }
                const uniqueSet = new Set(storageLocations.map(item => JSON.stringify(item)));
                let finalResult = [...uniqueSet].map(item => JSON.parse(item));
                for (var j = 0; j < finalResult.length; j++) {
                    jsonResult.push(
                        {
                            'DisplayValue': `${finalResult[j]}`,
                            'ReturnValue': `${finalResult[j]}`,
                        });
                }
            }
            return jsonResult;
        });
    
}
