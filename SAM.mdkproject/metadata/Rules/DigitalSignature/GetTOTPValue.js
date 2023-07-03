
export default function TOTPValue(context) {
    var totp = context.evaluateTargetPath('#Control:passcode/#Value');
    return Number(totp);
}
