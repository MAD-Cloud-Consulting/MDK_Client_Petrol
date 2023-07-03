import libForm from '../../../FOW/Common/Library/FormatLibrary';
import libCommon from '../../../Common/Library/CommonLibrary';

export default function StopListAssetCountCaption(context) {
    let readLink = context.binding['@odata.readLink'];
    return libCommon.getEntitySetCount(context, readLink + '/TechObjects', '').then((count) => libForm.formatStopListAssetCount(context, count));
}
