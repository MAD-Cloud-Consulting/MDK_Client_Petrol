import libCom from '../Common/Library/CommonLibrary';
import libDigSig from '../DigitalSignature/DigitalSignatureLibrary';

export default function AddPassphraseCheckRequiredFields(context) {
    var passphraseControl = context.evaluateTargetPath('#Control:passphrase');

    libCom.setInlineControlErrorVisibility(passphraseControl, false);


    return libDigSig.checkPassphraseLength(context, passphraseControl).then(function() {
        // clear all validations
        libCom.setInlineControlErrorVisibility(passphraseControl, false);
        context.getControl('FormCellContainer0').redraw();  
        return context.executeAction('/SAPAssetManager/Actions/DigitalSignature/PassCodeTOTPNav.action');
    }).catch(function() {
        // Errors exist
        context.getControl('FormCellContainer0').redraw();
        return Promise.resolve(false);
    });
}
