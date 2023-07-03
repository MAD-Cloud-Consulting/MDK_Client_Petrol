export default function CrewPageRefresh(context) {
    let sectionedTableProxy = context.getControls()[0];
    sectionedTableProxy.redraw();
}
