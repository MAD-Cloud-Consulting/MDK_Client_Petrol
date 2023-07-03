
import ApplicationSettings from '../Common/Library/ApplicationSettings';
import libVal from '../Common/Library/ValidationLibrary';

export default function GeometryValue(context) {
    try {
        let geometry = JSON.parse(ApplicationSettings.getString(context,'Geometry'));
        if (geometry && !libVal.evalIsEmpty(geometry.geometryValue)) {
            return geometry.geometryValue;
        }
        return '';
    } catch (error) {
        return '';
    }
}
