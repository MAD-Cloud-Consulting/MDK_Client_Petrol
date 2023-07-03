import setCaption from './DocumentListViewCaption';
export default function OnBDSListReturning(pageProxy) {
    setCaption(pageProxy);
    let sectionedTableProxy = pageProxy.getControls()[0];
    sectionedTableProxy.redraw();
}
