
import EnableNotificationEdit from './EnableNotificationEdit';
import GISAddEditEnabled from '../../Maps/GISAddEditEnabled';

export default function EnableNotificationGeometryEdit(context) {
    return (EnableNotificationEdit(context) && GISAddEditEnabled(context));
}
