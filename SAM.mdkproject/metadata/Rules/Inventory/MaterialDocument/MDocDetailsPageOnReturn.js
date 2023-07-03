import Logger from '../../Log/Logger';
import RedrawDetailsHeader from '../Common/RedrawDetailsHeader';

export default function MDocDetailsPageOnReturn(context) {
    try {
        if (context.evaluateTargetPathForAPI('#Page:MaterialDocReversalListPage')) {
            context.evaluateTargetPathForAPI('#Page:MaterialDocReversalListPage').getControl('SectionedTable').getSection('SectionObjectTable').redraw(true);
        }
    } catch (err) {
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/Inventory/CategoryMaterialDocItems.global').getValue(), 'MDocDetailsPageOnReturn(context)' + err);
    }
    return RedrawDetailsHeader(context);
}
