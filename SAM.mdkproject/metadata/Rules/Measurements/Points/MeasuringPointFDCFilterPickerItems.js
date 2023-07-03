import skipVisible from '../../Measurements/Points/MeasuringPointSkipVisible';

export default function MeasuringPointFDCFilterPickerItems(pageClientAPI) {
    var jsonResult = [];

    if (skipVisible(pageClientAPI)) { //Only include Skip option if feature is enabled
        jsonResult.push(
        {
            'DisplayValue': '$(L,skipped)',
            'ReturnValue': 'Skip',
        });
    }

    jsonResult.push(
    {
        'DisplayValue': '$(L,empty)',
        'ReturnValue': 'Empty',
    });

    jsonResult.push(
    {
        'DisplayValue': '$(L,in_error)',
        'ReturnValue': 'Error',
    });

    return jsonResult;

}
