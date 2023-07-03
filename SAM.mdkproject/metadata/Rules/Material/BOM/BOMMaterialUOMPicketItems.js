export default function BOMMaterialUOMPicketItems(context) {
    var jsonResult = [];
    jsonResult.push(
    {
        'DisplayValue': `${context.binding.UoM}`,
        'ReturnValue': `${context.binding.UoM}`,
    });
    return jsonResult;
}
