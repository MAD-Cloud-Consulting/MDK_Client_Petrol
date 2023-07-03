
import libCommon from '../Common/Library/CommonLibrary';

export default function NewGeometryReadLink(context) {
    return libCommon.getStateVariable(context, 'CreateNewGeometry')['@odata.readLink'];
}
