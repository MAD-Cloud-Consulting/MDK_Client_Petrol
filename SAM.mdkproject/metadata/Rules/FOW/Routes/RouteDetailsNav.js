import libRoute from './RouteLibrary';
import {GetRouteGeometryInformation} from './RouteGeometryInformation';

export default function RouteDetailsNav(context) {

    let pageProxy = context.constructor.name === 'PageProxy' ? context : context.getPageProxy();
    let currentActionBinding = pageProxy.getActionBinding();

    return context.read('/SAPAssetManager/Services/AssetManager.service', currentActionBinding['@odata.readLink'], [], libRoute.getRouteDetailsNavQueryOption()).then(function(result) {
        let newBinding = result.getItem(0);
        return GetRouteGeometryInformation(newBinding, context).then(function(value) {
            if (Object.keys(value).length > 0) {
                newBinding = Object.assign(newBinding, {mapData: value});
                pageProxy.setActionBinding(newBinding);
                return context.executeAction('/SAPAssetManager/Actions/FOW/Routes/RouteDetailsNav.action');
            }
            return context.executeAction('/SAPAssetManager/Actions/FOW/Routes/RouteDetailsNoMapNav.action');
        });
    });
}
