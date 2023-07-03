export default function ErrorArchiveDetailsRequestBody(context) {
    let errorObject = context.getPageProxy().binding.ErrorObject;

    let result = [];
    if (errorObject && errorObject.RequestBody) {
        let requestBody = JSON.parse(errorObject.RequestBody);
        let requestBodyKeys = Object.keys(requestBody);
        for (let key in requestBodyKeys) {
            result.push(requestBodyKeys[key] + ' : ' + requestBody[requestBodyKeys[key]]);
        }
    }
    return result.join('\n');
}
