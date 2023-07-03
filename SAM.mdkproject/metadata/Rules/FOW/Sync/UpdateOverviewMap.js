
export default function UpdateOverviewMap(context) {
    let pageProxy = context.evaluateTargetPathForAPI('#Page:OverviewPage');
    let sectionedTable = pageProxy.getControls()[0];
    let mapSection = sectionedTable.getSections()[0];
    let mapViewExtension = mapSection.getExtensions()[0];
    mapViewExtension.update();
}
