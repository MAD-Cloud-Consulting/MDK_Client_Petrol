import digSigLib from './DigitalSignatureLibrary';
export default function DigitalSignatureDate(context) {
    return digSigLib.isDigitalSignatureEnabled(context);
 }
