import NativeScriptObject from '../../Common/Library/NativeScriptObject';
import libVal from '../../Common/Library/ValidationLibrary';
import signatureDetails  from './SignatureObjectDetails';
/**
* To determine the watermark text
* @param {IClientAPI} context
*/
export default function SignatureWatermarkText(context) {
    let previousPage = context.evaluateTargetPathForAPI('#Page:-Previous');
    let previousPageClientData = previousPage.getClientData();

    context._context.binding = libVal.evalIsEmpty(previousPageClientData.currentObject) ? previousPage.binding : previousPageClientData.currentObject;
    let watermarkText = [];

    if (previousPageClientData.isCustomerSignature && context.WOSales_Nav && context.WOSales_Nav.Customer_Nav && context.WOSales_Nav.Customer_Nav.Name1) {
        watermarkText.push(context.WOSales_Nav.Customer_Nav.Name1);
    }

    watermarkText.push(signatureDetails(context));
    watermarkText.push('User:' + context.evaluateTargetPath('#Application/#ClientData/#Property:UserId'));
    return (NativeScriptObject.getNativeScriptObject(context).platformModule.isAndroid) ? watermarkText.join('\n') : watermarkText.join(',');
}
