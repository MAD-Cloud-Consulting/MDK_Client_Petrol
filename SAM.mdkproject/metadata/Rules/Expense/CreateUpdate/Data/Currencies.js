
export default function Currencies(controlProxy) {
    return controlProxy.read('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderHeaders', [], '$orderby=OrderCurrency').then(result => {
        var jsonResult = [];
        if (result && result.length) {
            result.forEach(function(element) {
                jsonResult.push(
                    {
                        'DisplayValue': element.OrderCurrency,
                        'ReturnValue': element.OrderCurrency,
                    });
            });
        }
        const uniqueSet = new Set(jsonResult.map(item => JSON.stringify(item)));
        let finalResult = [...uniqueSet].map(item => JSON.parse(item));
        
        return finalResult;
    });
}
