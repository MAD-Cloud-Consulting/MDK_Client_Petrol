import libCom from '../Common/Library/CommonLibrary';
import libDigSig from '../DigitalSignature/DigitalSignatureLibrary';

export default function AddPasscodeCheckRequiredFields(context) {
    var passcodeControl = context.evaluateTargetPath('#Control:passcode');

    libCom.setInlineControlErrorVisibility(passcodeControl, false);

    return libDigSig.checkPasscodeLength(context, passcodeControl).then(function() {
        // clear all validations
        libCom.setInlineControlErrorVisibility(passcodeControl, false);
        context.getControl('FormCellContainer0').redraw();
        return context.executeAction('/SAPAssetManager/Actions/OData/DigitalSignature/UpdateTOTPDevice.action');
    }).catch(function() {
        // Errors exist
        context.getControl('FormCellContainer0').redraw();
        return PromiseRejectionEvent.resove(false);
    });
}
