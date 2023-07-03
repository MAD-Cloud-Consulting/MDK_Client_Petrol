import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function PRTMiscellaneousListViewCaption(context) {    
    let queryString = '$filter=(PRTCategory eq \'0\')';
    return CommonLibrary.getEntitySetCount(context,context.binding['@odata.readLink']+'/Tools', queryString).then(count => {
        return context.localizeText('miscellaneous_x',[count]);
    });
}
