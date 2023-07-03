
export default function RedrawCompletePage(context) {
    var page = context.getPageProxy();
    var controls = page.getControls() || [];
    var sectionedTable = controls[0];
    if (sectionedTable) {
        sectionedTable.redraw();
    }
}
