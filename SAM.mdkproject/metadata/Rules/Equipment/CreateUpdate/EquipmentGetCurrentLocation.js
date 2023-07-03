
import GetCurrentGeometry from '../../Geometries/GetCurrentGeometry';

export default function EquipmentGetCurrentLocation(context) {
    return GetCurrentGeometry(context, 'Equipment');
}
