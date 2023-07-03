import ApplicationSettings from '../../Common/Library/ApplicationSettings';
import libCommon from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';
import GeometryFromMap from '../../Geometries/GeometryFromMap';
import EquipmentCreateNav from './EquipmentCreateNav';
import deviceType from '../../Common/DeviceType';
import isAndroid from '../../Common/IsAndroid';

export default function EquipmentCreateFromMap(context) {
    let geometry = GeometryFromMap(context);
    if (geometry && !libVal.evalIsEmpty(geometry.geometryValue)) {
        ApplicationSettings.setString(context,'Geometry', JSON.stringify(geometry));
    }
    libCommon.setStateVariable(context, 'GeometryObjectType', 'Equipment');
    if (deviceType(context) === 'Phone' && !isAndroid(context)) {
        return libCommon.sleep(500).then(() => {
            return EquipmentCreateNav(context);
        });
    }
    return EquipmentCreateNav(context);
}
