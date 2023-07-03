/**
* Get the mime type for the Signature
* @param {IClientAPI} context
*/
export default function SignatreOnCreateMimeType(context) {
    return context.evaluateTargetPath('#Control:SignatureCaptureFormCell/#Value').contentType;
}
