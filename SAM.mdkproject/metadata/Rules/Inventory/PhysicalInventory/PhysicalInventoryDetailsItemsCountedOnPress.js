import Logger from '../../Log/Logger';

export default async function PhysicalInventoryDetailsItemsCountedOnPress(context) {
    try {
        context.evaluateTargetPathForAPI('#Page:PhysicalInventoryItemsCountedListPage').getControl('SectionedTable').getSection('SectionObjectTable0').redraw();
    } catch (err) {
        Logger.error('PICount', err);
    }
}
