import {GetTechObjGeometryInformationForStop} from './StopGeometryInformation';

export default function StopDetailsNav(context) {

    let pageProxy = context.constructor.name === 'PageProxy' ? context : context.getPageProxy();
    let currentActionBinding = pageProxy.getActionBinding();
    return GetTechObjGeometryInformationForStop(currentActionBinding, context).then(function(value) {
        if (Object.keys(value).length > 0) {
            let newBinding = Object.assign(currentActionBinding, {mapData: value});
            pageProxy.setActionBinding(newBinding);
            return context.executeAction('/SAPAssetManager/Actions/FOW/Routes/Stops/StopDetailsNav.action');
        }
        return context.executeAction('/SAPAssetManager/Actions/FOW/Routes/Stops/StopDetailsNoMapNav.action');
    });
}
