import GetGeometryInformation from '../../Common/GetGeometryInformation';
import libCommon from '../../Common/Library/CommonLibrary';

export default function FunctionalLocationDeleteGeometryAllowed(context) {
    // If we already have geometry data...
    if (context.getPageProxy().getClientData().geometry) {
        if (Object.keys(context.getPageProxy().getClientData().geometry).length > 0) {
            return libCommon.isCurrentReadLinkLocal(context.binding['@odata.readLink']);
        }
    // Otherwise, determine if we should have geometry data
    } else {
        return GetGeometryInformation(context.getPageProxy(), 'FuncLocGeometries').then(function(value) {
            return value && Object.keys(value).length > 0 && libCommon.isCurrentReadLinkLocal(context.binding['@odata.readLink']);
        });
    }
}
