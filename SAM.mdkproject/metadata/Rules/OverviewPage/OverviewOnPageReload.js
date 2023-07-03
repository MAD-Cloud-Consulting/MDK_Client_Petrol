

export default function OverviewOnPageReload(context) {
    context.evaluateTargetPathForAPI('#Page:OverviewPage').getControls()[0].redraw();
}
