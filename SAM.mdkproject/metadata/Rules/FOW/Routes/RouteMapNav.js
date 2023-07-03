export default function RouteMapNav(context) {
    context.getPageProxy().setActionBinding(context.getPageProxy().binding.mapData);
    return context.executeAction('/SAPAssetManager/Actions/FOW/Routes/RouteMapNav.action');
}
