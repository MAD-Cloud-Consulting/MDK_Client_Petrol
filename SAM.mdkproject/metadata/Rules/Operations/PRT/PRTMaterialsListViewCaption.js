import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function PRTMaterialsListViewCaption(context) {    
    let queryString = '$filter=(PRTCategory eq \'M\')';
    return CommonLibrary.getEntitySetCount(context,context.binding['@odata.readLink']+'/Tools', queryString).then(count => {
        return context.localizeText('materials_x',[count]);
    });
}
