
import libCommon from '../../Common/Library/CommonLibrary';
import DocumentCreateDelete from '../../Documents/Create/DocumentCreateDelete';
import EquipmentCreateUpdateGeometryPost from './EquipmentCreateUpdateGeometryPost';

export default function EquipmentUpdateOnSuccess(context) {
    if (libCommon.getStateVariable(context, 'GeometryObjectType') === 'Equipment') {
        libCommon.setStateVariable(context, 'GeometryObjectType', '');
        return EquipmentCreateUpdateGeometryPost(context).then(() => {
            return DocumentCreateDelete(context);
        });
    }
    return DocumentCreateDelete(context);
}
