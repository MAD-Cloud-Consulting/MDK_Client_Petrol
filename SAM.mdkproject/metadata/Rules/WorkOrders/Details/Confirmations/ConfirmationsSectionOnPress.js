import ConfirmationsIsEnabled from '../../../Confirmations/ConfirmationsIsEnabled';

export default function ConfirmationsSectionOnCount(context) {

    if (ConfirmationsIsEnabled(context)) {
        return context.executeAction('/SAPAssetManager/Actions/Confirmations/WorkOrderConfirmationsNav.action');
    }
}
