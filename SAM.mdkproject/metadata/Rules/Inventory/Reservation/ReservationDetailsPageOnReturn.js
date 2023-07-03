import Logger from '../../Log/Logger';
import RedrawDetailsHeader from '../Common/RedrawDetailsHeader';

export default function ReservationDetailsPageOnReturn(context) {
    try {
        if (context.evaluateTargetPathForAPI('#Page:POMaterialDocItemsListPage')) {
            context.evaluateTargetPathForAPI('#Page:POMaterialDocItemsListPage').getControl('SectionedTable').getSection('SectionObjectTable').redraw(true);
        }
    } catch (err) {
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/Inventory/CategoryReservation.global').getValue(), 'ReservationDetailsPage(context)' + err);
    }
    return RedrawDetailsHeader(context);
}
