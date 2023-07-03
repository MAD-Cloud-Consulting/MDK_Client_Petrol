export default function PRTDocumentsListReturning(pageProxy) {
    let sectionedTableProxy = pageProxy.getControls()[0];
    sectionedTableProxy.redraw();
}
