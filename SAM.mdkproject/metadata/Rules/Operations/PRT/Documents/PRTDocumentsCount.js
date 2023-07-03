import CommonLibrary from '../../../Common/Library/CommonLibrary';

export default function PRTDocumentsCount(context) {
    return CommonLibrary.getEntitySetCount(context,context.getPageProxy().binding['@odata.readLink']+'/Tools', "$filter=PRTCategory eq 'D'");    
}
