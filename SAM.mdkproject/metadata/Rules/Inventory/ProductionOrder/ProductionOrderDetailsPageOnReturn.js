import Logger from '../../Log/Logger';
import RedrawDetailsHeader from '../Common/RedrawDetailsHeader';

export default function ProductionOrderDetailsPageOnReturn(context) {
    let pages = ['#Page:POMaterialDocItemsListPage', '#Page:PurchaseOrderItemsListPage', '#Page:ProductionOrderComponentsListPage'];
    let sections = ['SectionObjectTable', 'POItemsSectionObjectTable', 'PRDComponentsSectionObjectTable'];
    pages.forEach((pageName, index) => {
        let pageProxy;
        let section;
        // checking if page was initialized
        // if we would do without try-catch - it would be broken and
        // the rest of tha pages wouldn't be refreshed
        try {
            pageProxy = context.evaluateTargetPathForAPI(pageName);
            if (pageProxy) {
                section = pageProxy.getControl('SectionedTable').getSection(sections[index]);
            }
        } catch (err) {
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/Inventory/CategoryPurchaseOrder.global').getValue(), 'ProductionOrderDetailsPageOnReturn(context)' + err);
        }
        if (section) {
            section.redraw(true);
        }
    });
    return RedrawDetailsHeader(context);
}
