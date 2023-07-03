import libCom from '../../Common/Library/CommonLibrary';

export default function PhysicalInventoryDetailsOnReturning(context) {
    if (libCom.getStateVariable(context, 'RedrawPIItems')) {
        libCom.removeStateVariable(context, 'RedrawPIItems');
        context.evaluateTargetPathForAPI('#Page:PhysicalInventoryItemsListPage').getControl('SectionedTable').getSection('SectionObjectTable0').redraw(true);
    }
    if (libCom.getStateVariable(context, 'RedrawPIItemsCounted')) {
        libCom.removeStateVariable(context, 'RedrawPIItemsCounted');
        context.evaluateTargetPathForAPI('#Page:PhysicalInventoryItemsCountedListPage').getControl('SectionedTable').getSection('SectionObjectTable0').redraw(true);
    }
}
