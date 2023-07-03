/**
* Get the media for Signature Control
* @param {IClientAPI} context
*/
export default function SignatureOnCreateMedia(context) {
    return [context.evaluateTargetPath('#Control:SignatureCaptureFormCell/#Value')];
}
