import ApplicationSettings from '../../Common/Library/ApplicationSettings';
import libCommon from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';
import GeometryFromMap from '../../Geometries/GeometryFromMap';
import FunctionalLocationCreateNav from './FunctionalLocationCreateNav';
import deviceType from '../../Common/DeviceType';
import isAndroid from '../../Common/IsAndroid';

export default function FunctionalLocationCreateFromMap(context) {
    let geometry = GeometryFromMap(context);
    if (geometry && !libVal.evalIsEmpty(geometry.geometryValue)) {
        ApplicationSettings.setString(context,'Geometry', JSON.stringify(geometry));
    }
    libCommon.setStateVariable(context, 'GeometryObjectType', 'FunctionalLocation');
    if (deviceType(context) === 'Phone' && !isAndroid(context)) {
        return libCommon.sleep(500).then(() => {
            return FunctionalLocationCreateNav(context);
        });
    }
    return FunctionalLocationCreateNav(context);
}
