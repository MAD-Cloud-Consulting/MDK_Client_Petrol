
import EnableWorkOrderEdit from './EnableWorkOrderEdit';
import GISAddEditEnabled from '../../Maps/GISAddEditEnabled';

export default function EnableWorkOrderGeometryEdit(context) {
    return (EnableWorkOrderEdit(context) && GISAddEditEnabled(context));
}
