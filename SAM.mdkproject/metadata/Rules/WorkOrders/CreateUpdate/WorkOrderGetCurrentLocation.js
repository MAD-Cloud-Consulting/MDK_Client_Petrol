
import GetCurrentGeometry from '../../Geometries/GetCurrentGeometry';

export default function WorkOrderGetCurrentLocation(context) {
    return GetCurrentGeometry(context, 'WorkOrder');
}
