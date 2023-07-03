import libCommon from '../../../../Common/Library/CommonLibrary';
import libRoute from '../../RouteLibrary';

export default function AssetCount(context) {
    let readLink = context.getPageProxy().binding['@odata.readLink'];
    return libCommon.getEntitySetCount(context, readLink + '/TechObjects', libRoute.getFuncLocListQueryOptions());
}
