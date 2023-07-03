import WorkOrderListViewSetCaption from './WorkOrderListViewSetCaption';

export default function WorkOrderListViewOnReturning(context) {
    let sectionedTableProxy = context.getControls()[0];
    sectionedTableProxy.redraw();

    return WorkOrderListViewSetCaption(context);
}
