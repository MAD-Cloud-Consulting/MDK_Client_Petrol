import ConfirmationsIsEnabled from '../../../Confirmations/ConfirmationsIsEnabled';

export default function ConfirmationsSectionAccessory(context) {

    if (ConfirmationsIsEnabled(context)) {
        return 'disclosureIndicator';
    }
}
