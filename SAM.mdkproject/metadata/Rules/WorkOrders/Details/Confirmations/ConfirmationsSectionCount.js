import ConfirmationsIsEnabled from '../../../Confirmations/ConfirmationsIsEnabled';
import WorkOrderConfirmationsCount from '../../../Confirmations/WorkOrderDetails/WorkOrderConfirmationsCount';

export default function ConfirmationsSectionCount(context) {
    if (ConfirmationsIsEnabled(context)) {
        return WorkOrderConfirmationsCount(context);
    }
}
