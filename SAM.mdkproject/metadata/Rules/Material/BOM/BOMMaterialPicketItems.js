export default function BOMMaterialPicketItems(context) {
    var jsonResult = [];
    var desc = '';
    if (context.binding.MaterialDesc) {
        desc = context.binding.MaterialDesc + ' (' + context.binding.MaterialNum + ')';
    }
    jsonResult.push(
    {
        'DisplayValue': `${desc}`,
        'ReturnValue': `${context.binding.MaterialNum}`,
    });
    return jsonResult;
}
