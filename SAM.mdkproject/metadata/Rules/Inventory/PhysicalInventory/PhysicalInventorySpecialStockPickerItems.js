export default function StockTypePickerItems() {

    var jsonResult = [];

    jsonResult.push(
        {
            'DisplayValue': 'Warehouse',
            'ReturnValue': '1',
        });

    jsonResult.push(
        {
            'DisplayValue': 'Quality inspection',
            'ReturnValue': '2',
        });

    jsonResult.push(
        {
            'DisplayValue': 'Wrhse/QuInsp.(InvSa)',
            'ReturnValue': '3',
        });

    jsonResult.push(
        {
            'DisplayValue': 'Blocked',
            'ReturnValue': '4',
        });

    return jsonResult;

}
