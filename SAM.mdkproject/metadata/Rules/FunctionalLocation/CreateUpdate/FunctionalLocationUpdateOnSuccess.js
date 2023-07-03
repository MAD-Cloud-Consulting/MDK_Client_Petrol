
import libCommon from '../../Common/Library/CommonLibrary';
import DocumentCreateDelete from '../../Documents/Create/DocumentCreateDelete';
import FunctionalLocationCreateUpdateGeometryPost from './FunctionalLocationCreateUpdateGeometryPost';

export default function FunctionalLocationUpdateOnSuccess(context) {
    if (libCommon.getStateVariable(context, 'GeometryObjectType') === 'FunctionalLocation') {
        libCommon.setStateVariable(context, 'GeometryObjectType', '');
        return FunctionalLocationCreateUpdateGeometryPost(context).then(() => {
            return DocumentCreateDelete(context);
        });
    }
    return DocumentCreateDelete(context);
}
