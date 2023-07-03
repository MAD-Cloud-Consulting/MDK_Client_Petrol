/**
* Describe this function...
* @param {IClientAPI} context
*/
import libBase64 from '../Common/Library/Base64Library';
import isAndroid from '../Common/IsAndroid';
import Logger from '../Log/Logger';

export default function Passphrase(context) {
    var passphraseText = context.evaluateTargetPath('#Page:CreateDigitalSignature/#Control:passphrase/#Value');
    var passphraseBase64encoded = libBase64.transformStringToBase64(isAndroid(context), passphraseText);
    Logger.info(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryDigitalSignature/DigitalSignature.global').getValue(), 'passphraseBase64encoded = ' + passphraseBase64encoded);
    return passphraseBase64encoded;
}
