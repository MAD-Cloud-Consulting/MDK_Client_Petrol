import {GetStopOnlyGeometryInformation} from './StopGeometryInformation';

export default function StopMapNav(context) {
    let mapData = context.getPageProxy().binding.mapData;
    return GetStopOnlyGeometryInformation(context).then(function(stop) {
        if (Object.keys(stop).length > 0) {
            mapData.push(stop);
        }
        context.getPageProxy().setActionBinding(mapData);
        return context.executeAction('/SAPAssetManager/Actions/FOW/Routes/Stops/StopMapNav.action');
    });
}
