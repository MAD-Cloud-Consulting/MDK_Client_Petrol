
import libCommon from '../Common/Library/CommonLibrary';

export default function GeometryReadLink(context) {
    return libCommon.getStateVariable(context, 'CreateGeometry')['@odata.readLink'];
}
