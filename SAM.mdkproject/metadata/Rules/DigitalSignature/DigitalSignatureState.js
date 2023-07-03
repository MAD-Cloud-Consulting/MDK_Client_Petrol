export default function DigitalSignatureState(context) {
    let state = '-';
    switch (context.binding.State) {
        case '1': 
            state = context.localizeText('completed');
            break;
        case '2': 
            state = context.localizeText('canceled');
            break;
        case '3': 
            state = context.localizeText('current');
            break;
        case '':
            state = context.localizeText('New');
            break;
        default:
            break;
    }
    return state;
 }
