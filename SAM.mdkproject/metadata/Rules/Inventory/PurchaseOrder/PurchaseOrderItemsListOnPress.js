export default function PurchaseOrderItemsListOnPress(context) {
    context.evaluateTargetPathForAPI('#Page:PurchaseOrderItemsListPage').getControl('SectionedTable').redraw();
}
