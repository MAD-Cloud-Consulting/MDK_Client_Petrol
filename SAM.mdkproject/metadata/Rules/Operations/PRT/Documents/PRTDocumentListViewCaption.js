import CommonLibrary from '../../../Common/Library/CommonLibrary';

export default function PRTDocumentListViewCaption(context) {    
    let queryString = '$filter=(PRTCategory eq \'D\')';
    return CommonLibrary.getEntitySetCount(context,context.binding['@odata.readLink']+'/Tools', queryString).then(count => {
        return context.localizeText('documents_x',[count]);
    });
}
