
import ConfirmationsIsEnabled from '../../../Confirmations/ConfirmationsIsEnabled';


export default function ConfirmationsSectionTitle(context) {
    if (ConfirmationsIsEnabled(context)) {
        return context.localizeText('confirmations');
    }
    // Get around random `TEst` value setting
    // No idea where that is coming from
    return ' ';
}
