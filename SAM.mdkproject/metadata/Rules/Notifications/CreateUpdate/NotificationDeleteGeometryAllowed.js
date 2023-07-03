import GetGeometryInformation from '../../Common/GetGeometryInformation';
import libCommon from '../../Common/Library/CommonLibrary';

export default function NotificationDeleteGeometryAllowed(context) {
    // If we already have geometry data...
    if (context.getPageProxy().getClientData().geometry) {
        if (Object.keys(context.getPageProxy().getClientData().geometry).length > 0) {
            return libCommon.isCurrentReadLinkLocal(context.binding['@odata.readLink']);
        }
    // Otherwise, determine if we should have geometry data
    } else {
        return GetGeometryInformation(context.getPageProxy(), 'NotifGeometries').then(function(value) {
            return !!value && Object.keys(value).length > 0 && libCommon.isCurrentReadLinkLocal(context.binding['@odata.readLink']);
        });
    }
}
