export default function StopFootnote(context) {
    let routeId = context.binding.RouteID;
    return context.read('/SAPAssetManager/Services/AssetManager.service', `MyRoutes('${routeId}')`, [], '').then(function(result) {
        if (result && result.getItem(0)) {
            let msg = (result.getItem(0).Description)?result.getItem(0).Description:routeId ;
            return context.localizeText('fow_stop_belongs_to_x', [msg]);   
        } else {
            return null;
        }
    });
}
