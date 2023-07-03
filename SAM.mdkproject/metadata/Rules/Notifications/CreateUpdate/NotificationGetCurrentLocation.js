
import GetCurrentGeometry from '../../Geometries/GetCurrentGeometry';

export default function NotificationGetCurrentLocation(context) {
    return GetCurrentGeometry(context, 'Notification');
}
