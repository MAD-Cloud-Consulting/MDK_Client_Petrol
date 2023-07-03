
export default function RouteDetailsOnPageReturning(context) {
    // Refresh the map view
    let extension = context.getControls()[0].getSections()[3];
    if (extension) {
        extension.redraw();
    }
}
