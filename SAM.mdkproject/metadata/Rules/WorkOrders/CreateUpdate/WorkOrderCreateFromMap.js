import ApplicationSettings from '../../Common/Library/ApplicationSettings';
import libCommon from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';
import GeometryFromMap from '../../Geometries/GeometryFromMap';
import WorkOrderCreateNav from './WorkOrderCreateNav';
import deviceType from '../../Common/DeviceType';
import isAndroid from '../../Common/IsAndroid';

export default function WorkOrderCreateFromMap(context) {
    let geometry = GeometryFromMap(context);
    if (geometry && !libVal.evalIsEmpty(geometry.geometryValue)) {
        ApplicationSettings.setString(context, 'Geometry', JSON.stringify(geometry));
    }
    libCommon.setStateVariable(context, 'GeometryObjectType', 'WorkOrder');
    if (deviceType(context) === 'Phone' && !isAndroid(context)) {
        return libCommon.sleep(500).then(() => {
            return WorkOrderCreateNav(context);
        });
    }
    return WorkOrderCreateNav(context);
}
