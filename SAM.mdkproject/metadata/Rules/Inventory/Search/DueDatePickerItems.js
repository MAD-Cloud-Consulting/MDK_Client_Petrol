export default function DueDatePickerItems() {

    var jsonResult = [];

    jsonResult.push(
        {
            'DisplayValue': '$(L,today)',
            'ReturnValue': 'T',
        });

    jsonResult.push(
        {
            'DisplayValue': '$(L,last_week)',
            'ReturnValue': 'L',
        });

    jsonResult.push(
        {
            'DisplayValue': '$(L,next_week)',
            'ReturnValue': 'N',
        });

    return jsonResult;

}
