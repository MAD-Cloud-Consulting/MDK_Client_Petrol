import IsAndroid from '../../Common/IsAndroid';

export default function SignatureHelperText(context) {
    if (IsAndroid(context)) { //only show this on android as MDK is already showing default helper text on ios
        return context.localizeText('initial_signature_text');
    } else {
        return '';
    }
}
